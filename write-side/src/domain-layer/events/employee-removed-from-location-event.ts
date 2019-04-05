import { BaseEvent } from "./base-event";

export class EmployeeRemovedFromLocationEvent extends BaseEvent
{
    readonly oldLocationID: any;
    readonly employeeID: any;

    constructor(id: any, oldLocationID: any, employeeID: any) {
        super();
        
        this.id = id;
        this.oldLocationID = oldLocationID;
        this.employeeID = employeeID;
    }
}