import { CreateLocationRequest } from "../../dtos/create-location-request";
import { CreateLocationCommand } from "../../domain-layer/commands/create-location-command";
import { AutoMapper } from "automapper-ts-node";
import { ICommandSender } from "cqrs-lite";

export class LocationService {

    constructor(private commandSender: ICommandSender, private mapper: AutoMapper) {
    }

    async create(request: CreateLocationRequest) {

        try {
            let createLocationCommand: CreateLocationCommand = this.mapper.map('CreateLocationRequest', 'CreateLocationCommand', request);
            this.commandSender.send(createLocationCommand);

            Promise.resolve();
        }
        catch (error) {
            console.log(error);
            Promise.reject();
        }
    }
}