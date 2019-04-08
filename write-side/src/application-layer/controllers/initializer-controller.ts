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
    createEmployeeRequestValidator: CreateEmployeeRequestValidator;
 
    employeeService: EmployeeService;
    locationService: LocationService;

    constructor(commandSender: ICommandSender, mapper: AutoMapper, employeeRepository: IEmployeeRepository, locationRepository: ILocationRepository) {
        this.createLocationRequestValidator = new CreateLocationRequestValidator(locationRepository);
        this.createEmployeeRequestValidator = new CreateEmployeeRequestValidator(employeeRepository, locationRepository);

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
            request.city = "Somewhere";
            request.streetAddress = "4321 S Second St";
            request.state = "KS";
            request.postalCode = "32203";
            await this.sendCreateLocationRequest(request);

            request = new CreateLocationRequest();
            request.locationID = 3;
            request.city = "Everywhere";
            request.streetAddress = "5879 S One St";
            request.state = "KS";
            request.postalCode = "67188";
            await this.sendCreateLocationRequest(request);

            request = new CreateLocationRequest();
            request.locationID = 4;
            request.city = "Where?!";
            request.streetAddress = "5879 S One St";
            request.state = "KS";
            request.postalCode = "67188";
            await this.sendCreateLocationRequest(request);

            request = new CreateLocationRequest();
            request.locationID = 5;
            request.city = "There";
            request.streetAddress = "5879 S One St";
            request.state = "KS";
            request.postalCode = "67188";
            await this.sendCreateLocationRequest(request);

            let request1: CreateEmployeeRequest;

            request1 = new CreateEmployeeRequest();
            request1.locationID = 1;
            request1.firstName = "John";
            request1.lastName = "Smith";
            request1.jobTitle = "Developer";
            request1.dateOfBirth = new Date(1978, 10, 5);
            await this.sendCreateEmployeeRequest(request1);

            request1 = new CreateEmployeeRequest();
            request1.locationID = 5;
            request1.firstName = "Mattew";
            request1.lastName = "Ramon";
            request1.jobTitle = "Architect";
            request1.dateOfBirth = new Date(1968, 3, 11);
            await this.sendCreateEmployeeRequest(request1);

            request1 = new CreateEmployeeRequest();
            request1.locationID = 3;
            request1.firstName = "Josha";
            request1.lastName = "Mariano";
            request1.jobTitle = "Fisherman";
            request1.dateOfBirth = new Date(1954, 5, 5);
            await this.sendCreateEmployeeRequest(request1);

            res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async sendCreateLocationRequest(request: CreateLocationRequest): Promise<boolean> {
        if (!await this.createLocationRequestValidator.validate(request))
            throw new Error('Invalid create location request');
        await this.locationService.create(request);

        return Promise.resolve(true);
    }

    async sendCreateEmployeeRequest(request: CreateEmployeeRequest): Promise<boolean> {
        if (!await this.createEmployeeRequestValidator.validate(request))
            throw new Error('Invalid create employee request');
        await this.employeeService.create(request);

        return Promise.resolve(true);
    }
}