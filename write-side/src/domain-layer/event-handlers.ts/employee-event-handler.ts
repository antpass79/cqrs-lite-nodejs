import { EmployeeCreatedEvent } from "../events/employee-created-event";
import { IEventHandler } from "cqrs-lite";
import { IEmployeeRepository } from "../write-model/repositories/employee-repository";
import { EmployeeWM } from "../write-model/employee-wm";
import { AutoMapper } from "automapper-ts-node";

export class EmployeeEventHandler implements IEventHandler<EmployeeCreatedEvent> {
    private readonly _mapper: AutoMapper;
    private readonly _employeeRepository: IEmployeeRepository;

    constructor(mapper: AutoMapper, employeeRepository: IEmployeeRepository) {
        this._mapper = mapper;
        this._employeeRepository = employeeRepository;
    }

    async handle(message: EmployeeCreatedEvent): Promise<boolean> {
        let employee: EmployeeWM = this._mapper.map('EmployeeCreatedEvent', 'EmployeeWM', message);
        let result = await this._employeeRepository.save(employee);

        return Promise.resolve<boolean>(result);
    }
}