import express from 'express';
import * as bodyParser from "body-parser";
import cors from 'cors';

import { LocationRepository, EmployeeRepository, LocationM, EmployeeM } from 'cqrs-lite-common';

import {
    InProcessBus,
    Session,
    ISession,
    IRepository,
    CacheRepository,
    Repository
} from 'cqrs-lite';

import { AutoMapper } from 'automapper-ts-node';
import { EmployeeRoute } from './application-layer/routes/employee-route';
import { LocationRoute } from './application-layer/routes/location-route';
import { NodeConfig } from './utilities/node-config';
import { CreateEmployeeRequest } from './dtos/create-employee-request';
import { CreateEmployeeCommand } from './domain-layer/commands/create-employee-command';
import { IResolutionContext } from 'automapper-ts-node/interfaces/IResolutionContext';
import { CreateLocationRequest } from './dtos/create-location-request';
import { CreateLocationCommand } from './domain-layer/commands/create-location-command';
import { EmployeeCommandHandler } from './domain-layer/command-handlers/employee-command-handler';
import { InMemoryEventStore } from './domain-layer/event-store/in-memory-event-store';
import { LocationCommandHandler } from './domain-layer/command-handlers/location-command-handler';
import { AssignEmployeeToLocationCommand } from './domain-layer/commands/assign-employee-to-location-command';
import { RemoveEmployeeFromLocationCommand } from './domain-layer/commands/remove-employee-from-location-command';
import { Guid } from './utilities/guid';
import { ICommunicationConfiguration } from './application-layer/communication-configuration';
import { InitializerRoute } from './application-layer/routes/initializer-route';
import { EmployeeEventHandler } from './domain-layer/event-handlers.ts/employee-event-handler';
import { LocationEventHandler } from './domain-layer/event-handlers.ts/location-event-handler';
import { EmployeeCreatedEvent } from './domain-layer/events/employee-created-event';
import { LocationCreatedEvent } from './domain-layer/events/location-created-event';
import { EmployeeAssignedToLocationEvent } from './domain-layer/events/employee-assigned-to-location-event';
import { EmployeeRemovedFromLocationEvent } from './domain-layer/events/employee-removed-from-location-event';

export class Server {

    private _port: number | string;
    get port() {
        return this._port;
    }

    private _app: express.Application;
    private _communicationConfiguration: ICommunicationConfiguration;

    constructor(port: number | string) {
        this._port = port;

        this._app = express();

        this._communicationConfiguration = {
            app: this._app,
            autoMapper: new AutoMapper(),
            bus: new InProcessBus(),
            employeeRepository: new EmployeeRepository(),
            locationRepository: new LocationRepository()
        };

        this.configure(this._app);
    }

    async start() {

        this._app.listen(this.port, () => {
            console.log('Server listening on port ' + this.port);
        });
    }

    private configure(app: express.Application) {

        this.configParser(app);
        this.configCors(app);
        this.configureHandlers(app);
        this.configureRoutes(app);
        this.configureAutoMapper(app);
    }

    private configParser(app: express.Application) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    }

    private configCors(app: express.Application) {

        let nodeConfig = new NodeConfig();

        let originsWhitelist = nodeConfig.getValue('ORIGINS_WHITE_LIST');
        let corsOptions = {
            origin: (origin: any, callback: any) => {
                var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
                callback(null, isWhitelisted);
            },
            credentials: true
        }
        app.use(cors(corsOptions));
    }

    private configureRoutes(app: express.Application) {

        let initializerRoute = new InitializerRoute(this._communicationConfiguration);
        app.use('/initialize', initializerRoute.initRoute());
        let employeeRoute = new EmployeeRoute(this._communicationConfiguration);
        app.use('/employee', employeeRoute.initRoute());
        let locationRoute = new LocationRoute(this._communicationConfiguration);
        app.use('/location', locationRoute.initRoute());
    }

    private configureAutoMapper(app: express.Application) {

        this._communicationConfiguration.autoMapper.createMap('CreateEmployeeRequest', 'CreateEmployeeCommand').
            convertUsing((resolutionContext: IResolutionContext) => {

                let createEmployeeRequest: CreateEmployeeRequest = resolutionContext.sourceValue as CreateEmployeeRequest;
                return new CreateEmployeeCommand(
                    Guid.newGuid(),
                    Guid.newGuid(),
                    createEmployeeRequest.firstName,
                    createEmployeeRequest.lastName,
                    createEmployeeRequest.dateOfBirth,
                    createEmployeeRequest.jobTitle);
            });

        this._communicationConfiguration.autoMapper.createMap('CreateLocationRequest', 'CreateLocationCommand').
            convertUsing((resolutionContext: IResolutionContext) => {

                let createLocationRequest: CreateLocationRequest = resolutionContext.sourceValue as CreateLocationRequest;
                return new CreateLocationCommand(
                    Guid.newGuid(),
                    createLocationRequest.locationID,
                    createLocationRequest.streetAddress,
                    createLocationRequest.city,
                    createLocationRequest.state,
                    createLocationRequest.postalCode);
            });

        this._communicationConfiguration.autoMapper.createMap('EmployeeCreatedEvent', 'EmployeeWM').
            convertUsing((resolutionContext: IResolutionContext) => {

                let employeeCreatedEvent: EmployeeCreatedEvent = resolutionContext.sourceValue as EmployeeCreatedEvent;
                let employeeRM: EmployeeM = new EmployeeM();
                employeeRM.aggregateID = employeeCreatedEvent.id;
                employeeRM.dateOfBirth = employeeCreatedEvent.dateOfBirth;
                employeeRM.employeeID = employeeCreatedEvent.employeeID;
                employeeRM.firstName = employeeCreatedEvent.firstName;
                employeeRM.jobTitle = employeeCreatedEvent.jobTitle;
                employeeRM.lastName = employeeCreatedEvent.lastName;

                return employeeRM;
            });

        this._communicationConfiguration.autoMapper.createMap('LocationCreatedEvent', 'LocationWM').
            convertUsing((resolutionContext: IResolutionContext) => {

                let locationCreatedEvent: LocationCreatedEvent = resolutionContext.sourceValue as LocationCreatedEvent;
                let locationRM: LocationM = new LocationM();
                locationRM.aggregateID = locationCreatedEvent.id;
                locationRM.city = locationCreatedEvent.city;
                locationRM.locationID = locationCreatedEvent.locationID;
                locationRM.postalCode = locationCreatedEvent.postalCode;
                locationRM.state = locationCreatedEvent.state;
                locationRM.streetAddress = locationCreatedEvent.streetAddress;

                return locationRM;
            });
    }

    private configureHandlers(app: express.Application) {

        let inMemoryEventStore: InMemoryEventStore = new InMemoryEventStore(this._communicationConfiguration.bus);
        let repository: IRepository = new CacheRepository(new Repository(inMemoryEventStore), inMemoryEventStore);
        let session: ISession = new Session(repository);

        let employeeCommandHandler: EmployeeCommandHandler = new EmployeeCommandHandler(session);
        this._communicationConfiguration.bus.registerHandler((CreateEmployeeCommand as any).name, (command: CreateEmployeeCommand) => employeeCommandHandler.handle(command));
        let locationCommandHandler: LocationCommandHandler = new LocationCommandHandler(session);
        this._communicationConfiguration.bus.registerHandler((CreateLocationCommand as any).name, (command: CreateLocationCommand | AssignEmployeeToLocationCommand | RemoveEmployeeFromLocationCommand) => locationCommandHandler.handle(command));
        this._communicationConfiguration.bus.registerHandler((AssignEmployeeToLocationCommand as any).name, (command: CreateLocationCommand | AssignEmployeeToLocationCommand | RemoveEmployeeFromLocationCommand) => locationCommandHandler.handle(command));
        this._communicationConfiguration.bus.registerHandler((RemoveEmployeeFromLocationCommand as any).name, (command: CreateLocationCommand | AssignEmployeeToLocationCommand | RemoveEmployeeFromLocationCommand) => locationCommandHandler.handle(command));

        let employeeEventHandler: EmployeeEventHandler = new EmployeeEventHandler(this._communicationConfiguration.autoMapper, this._communicationConfiguration.employeeRepository);
        this._communicationConfiguration.bus.registerHandler((EmployeeCreatedEvent as any).name, (message: EmployeeCreatedEvent) => employeeEventHandler.handle(message));
        let locationEventHandler: LocationEventHandler = new LocationEventHandler(this._communicationConfiguration.autoMapper, this._communicationConfiguration.locationRepository, this._communicationConfiguration.employeeRepository);
        this._communicationConfiguration.bus.registerHandler((LocationCreatedEvent as any).name, (message: LocationCreatedEvent | EmployeeAssignedToLocationEvent | EmployeeRemovedFromLocationEvent) => locationEventHandler.handle(message));
        this._communicationConfiguration.bus.registerHandler((EmployeeAssignedToLocationEvent as any).name, (message: LocationCreatedEvent | EmployeeAssignedToLocationEvent | EmployeeRemovedFromLocationEvent) => locationEventHandler.handle(message));
        this._communicationConfiguration.bus.registerHandler((EmployeeRemovedFromLocationEvent as any).name, (message: LocationCreatedEvent | EmployeeAssignedToLocationEvent | EmployeeRemovedFromLocationEvent) => locationEventHandler.handle(message));
    }
}