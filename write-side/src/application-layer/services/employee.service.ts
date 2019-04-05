import { CreateEmployeeRequest } from "../../dtos/create-employee-request";
import { CreateEmployeeCommand } from "../../domain-layer/commands/create-employee-command";
import { ILocationRepository } from "../../domain-layer/write-model/repositories/location-repository";
import { AutoMapper } from "automapper-ts-node";
import { ICommandSender } from "cqrs-lite";
import { AssignEmployeeToLocationCommand } from "../../domain-layer/commands/assign-employee-to-location-command";

export class EmployeeService {

    constructor(private commandSender: ICommandSender, private mapper: AutoMapper, private locationRepository: ILocationRepository) {
    }

    async create(request: CreateEmployeeRequest) {

        try {
            let createEmployeeCommand: CreateEmployeeCommand = this.mapper.map('CreateEmployeeRequest', 'CreateEmployeeCommand', request);
            this.commandSender.send(createEmployeeCommand);

            let locationAggregateID = (await this.locationRepository.getByID(request.locationID)).aggregateID;
            let assignCommand = new AssignEmployeeToLocationCommand(locationAggregateID, request.locationID, createEmployeeCommand.employeeID);
            this.commandSender.send(assignCommand);

            Promise.resolve();
        }
        catch (error) {
            console.log(error);
            Promise.reject();
        }
    }
}