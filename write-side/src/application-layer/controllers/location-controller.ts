import { ICommandSender } from "cqrs-lite";
import { AssignEmployeeToLocationCommand } from "../../domain-layer/commands/assign-employee-to-location-command";
import { CreateLocationCommand } from "../../domain-layer/commands/create-location-command";
import { CreateLocationRequest, CreateLocationRequestValidator } from "../../dtos/create-location-request";
import { AssignEmployeeToLocationRequest, AssignEmployeeToLocationRequestValidator } from "../../dtos/assign-employee-to-location-request";
import { RemoveEmployeeFromLocationCommand } from "../../domain-layer/commands/remove-employee-from-location-command";
import { ILocationRepository } from "../../domain-layer/write-model/repositories/location-repository";
import { IEmployeeRepository } from "../../domain-layer/write-model/repositories/employee-repository";
import { AutoMapper } from "automapper-ts-node";
import { LocationService } from "../services/location.service";

export class LocationController {

    createLocationRequestValidator: CreateLocationRequestValidator;
    assignEmployeeToLocationRequestValidator: AssignEmployeeToLocationRequestValidator;

    locationService: LocationService;

    constructor(private commandSender: ICommandSender, private mapper: AutoMapper, private locationRepository: ILocationRepository, private employeeRepository: IEmployeeRepository) {
        this.createLocationRequestValidator = new CreateLocationRequestValidator(locationRepository);
        this.assignEmployeeToLocationRequestValidator = new AssignEmployeeToLocationRequestValidator(employeeRepository, locationRepository);

        this.locationService = new LocationService(commandSender, mapper);
    }

    async create(req: any, res: any) {

        try {
            let createLocationRequest: CreateLocationRequest = req.body.location;
            if (!await this.createLocationRequestValidator.validate(createLocationRequest))
                throw new Error('Invalid request');

            await this.locationService.create(createLocationRequest);

            res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async assignEmployee(req: any, res: any)
    {
        let assignEmployeeToLocationRequest : AssignEmployeeToLocationRequest = req.body.assignEmployeeToLocationRequest;
        if (!await this.assignEmployeeToLocationRequestValidator.validate(assignEmployeeToLocationRequest))
            throw new Error('Invalid request');

        let employee = this.employeeRepository.getByID(assignEmployeeToLocationRequest.employeeID);

        if ((await employee).locationID != 0) {
            let oldLocationAggregateID = (await this.locationRepository.getByID((await employee).locationID)).aggregateID;
            let removeCommand: RemoveEmployeeFromLocationCommand = new RemoveEmployeeFromLocationCommand(oldLocationAggregateID, assignEmployeeToLocationRequest.locationID, (await employee).employeeID);
            this.commandSender.send(removeCommand);
        }

        let locationAggregateID = (await this.locationRepository.getByID(assignEmployeeToLocationRequest.locationID)).aggregateID;
        let assignCommand = new AssignEmployeeToLocationCommand(locationAggregateID, assignEmployeeToLocationRequest.locationID, assignEmployeeToLocationRequest.employeeID);
        this.commandSender.send(assignCommand);

        res.sendStatus(200);
    }    
}