import { ICommandSender } from "cqrs-lite";
import { ILocationRepository, IEmployeeRepository } from "cqrs-lite-common";
import { CreateEmployeeRequest, CreateEmployeeRequestValidator } from "../../dtos/create-employee-request";
import { AutoMapper } from "automapper-ts-node";
import { EmployeeService } from "../services/employee.service";

export class EmployeeController {

    createEmployeeRequestValidator: CreateEmployeeRequestValidator;
    
    employeeService: EmployeeService;

    constructor(commandSender: ICommandSender, mapper: AutoMapper, employeeRepository: IEmployeeRepository, locationRepository: ILocationRepository) {
        this.createEmployeeRequestValidator = new CreateEmployeeRequestValidator(employeeRepository, locationRepository);

        this.employeeService = new EmployeeService(commandSender, mapper, locationRepository);        
    }

    async create(req: any, res: any) {

        try {
            let createEmployeeRequest: CreateEmployeeRequest = req.body.employee;
            if (!await this.createEmployeeRequestValidator.validate(createEmployeeRequest))
                throw new Error('Invalid request');
            
            await this.employeeService.create(createEmployeeRequest);

            res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}