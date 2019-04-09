import express from 'express';
import * as bodyParser from "body-parser";
import cors from 'cors';

import {
    InProcessBus
} from 'cqrs-lite';

import { AutoMapper } from 'automapper-ts-node';
import { EmployeeRoute } from './application-layer/routes/employee-route';
import { LocationRoute } from './application-layer/routes/location-route';
import { NodeConfig } from './utilities/node-config';
import { LocationRepository, EmployeeRepository } from 'cqrs-lite-common';
import { ICommunicationConfiguration } from './application-layer/communication-configuration';

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
        this.configureRoutes(app);
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

        let employeeRoute = new EmployeeRoute(this._communicationConfiguration);
        app.use('/employee', employeeRoute.initRoute());
        let locationRoute = new LocationRoute(this._communicationConfiguration);
        app.use('/location', locationRoute.initRoute());
    }
}