import { BaseCommand } from "./base-command";

export class AssignEmployeeToLocationCommand extends BaseCommand {
    readonly employeeID: any;
    readonly locationID: any;

    constructor(id: any, locationID: any, employeeID: any) {
        super();

        this.id = id;
        this.employeeID = employeeID;
        this.locationID = locationID;
    }
}