import { AggregateRoot } from "cqrs-lite";
import { EmployeeCreatedEvent } from "../events/employee-created-event";

export class Employee extends AggregateRoot {
    
    private _employeeID: any;
    private _firstName: string;
    private _lastName: string;
    private _dateOfBirth: Date;
    private _jobTitle: string;

    constructor(id: any, employeeID: any, firstName: string, lastName: string, dateOfBirth: Date, jobTitle: string) {
        super();

        this._id = id;
        this._employeeID = employeeID;
        this._firstName = firstName;
        this._lastName = lastName;
        this._dateOfBirth = dateOfBirth;
        this._jobTitle = jobTitle;

        this.applyChange(new EmployeeCreatedEvent(id, employeeID, firstName, lastName, dateOfBirth, jobTitle));
    }
}