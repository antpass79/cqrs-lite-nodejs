import { CreateEmployeeCommand } from "../commands/create-employee-command";
import { Employee } from "../write-model/employee";
import { ICommandHandler, ISession } from "cqrs-lite";

export class EmployeeCommandHandler implements ICommandHandler<CreateEmployeeCommand> {
    private readonly _session: ISession;

    constructor(session: ISession) {
        this._session = session;
    }

    handle(command: CreateEmployeeCommand): void
    {
        let employee: Employee = new Employee(command.id, command.employeeID, command.firstName, command.lastName, command.dateOfBirth, command.jobTitle);
        this._session.add(employee);
        this._session.commit();
    }
}