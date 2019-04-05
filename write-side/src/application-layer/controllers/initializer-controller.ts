import { ICommandSender } from "cqrs-lite";
import { CreateEmployeeCommand } from "../../domain-layer/commands/create-employee-command";
import { AssignEmployeeToLocationCommand } from "../../domain-layer/commands/assign-employee-to-location-command";
import { CreateEmployeeRequest, CreateEmployeeRequestValidator } from "../../dtos/create-employee-request";
import { ILocationRepository } from "../../domain-layer/write-model/repositories/location-repository";
import { AutoMapper } from "automapper-ts-node";
import { EmployeeService } from "../services/employee.service";
import { CreateLocationRequest, CreateLocationRequestValidator } from "../../dtos/create-location-request";
import { LocationService } from "../services/location.service";
import { IEmployeeRepository } from "../../domain-layer/write-model/repositories/employee-repository";

export class InitializerController {

    createLocationRequestValidator: CreateLocationRequestValidator;
 
    employeeService: EmployeeService;
    locationService: LocationService;

    constructor(commandSender: ICommandSender, mapper: AutoMapper, locationRepository: ILocationRepository) {
        this.createLocationRequestValidator = new CreateLocationRequestValidator(locationRepository);

        this.employeeService = new EmployeeService(commandSender, mapper, locationRepository);
        this.locationService = new LocationService(commandSender, mapper);
    }

    async init(req: any, res: any) {

        try {
            let request: CreateLocationRequest;

            request = new CreateLocationRequest();
            request.locationID = 1;
            request.city = "Anywhere";
            request.streetAddress = "1234 S Main St";
            request.state = "KS";
            request.postalCode = "67203";
            await this.sendCreateLocationRequest(request);

            request = new CreateLocationRequest();
            request.locationID = 2;
            request.city = "Anywhere";
            request.streetAddress = "4321 S Second St";
            request.state = "KS";
            request.postalCode = "32203";
            await this.sendCreateLocationRequest(request);

            request = new CreateLocationRequest();
            request.locationID = 3;
            request.city = "Anywhere";
            request.streetAddress = "5879 S One St";
            request.state = "KS";
            request.postalCode = "67188";
            await this.sendCreateLocationRequest(request);

            res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async sendCreateLocationRequest(request: CreateLocationRequest): Promise<boolean> {
        if (!await this.createLocationRequestValidator.validate(request))
            throw new Error('Invalid request');
        await this.locationService.create(request);

        return Promise.resolve(true);
    }
}