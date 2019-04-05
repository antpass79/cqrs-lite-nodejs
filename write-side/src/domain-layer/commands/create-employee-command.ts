import { BaseCommand } from './base-command';

export class CreateEmployeeCommand extends BaseCommand {

    readonly employeeID: any;
    readonly firstName: string;
    readonly lastName: string;
    readonly dateOfBirth: Date;
    readonly jobTitle: string;

    constructor(id: any, employeeID: any, firstName: string, lastName: string, dateOfBirth: Date, jobTitle: string) {

        super();

        this.id = id;
        this.employeeID = employeeID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.jobTitle = jobTitle;
    }
}