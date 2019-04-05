import { BaseEvent } from "./base-event";

export class EmployeeAssignedToLocationEvent extends BaseEvent {
    readonly newLocationID: any;
    readonly employeeID: any;

    constructor(id: any, newLocationID: any, employeeID: any) {
        super();

        this.id = id;
        this.newLocationID = newLocationID;
        this.employeeID = employeeID;
    }
}