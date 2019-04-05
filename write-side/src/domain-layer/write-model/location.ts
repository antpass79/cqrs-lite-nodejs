import { AggregateRoot } from "cqrs-lite";
import { LocationCreatedEvent } from "../events/location-created-event";
import { EmployeeAssignedToLocationEvent } from "../events/employee-assigned-to-location-event";
import { EmployeeRemovedFromLocationEvent } from "../events/employee-removed-from-location-event";

export class Location extends AggregateRoot {
    private _locationID: any;
    private _streetAddress: string;
    private _city: string;
    private _state: string;
    private _postalCode: string;
    private _employees: any[];

    constructor(id: any, locationID: any, streetAddress: string, city: string, state: string, postalCode: string) {
        super();

        this._id = id;
        this._locationID = locationID;
        this._streetAddress = streetAddress;
        this._city = city;
        this._state = state;
        this._postalCode = postalCode;
        this._employees = [];

        this.applyChange(new LocationCreatedEvent(id, locationID, streetAddress, city, state, postalCode));
    }

    public addEmployee(employeeID: any): void {
        this._employees.push(employeeID);
        this.applyChange(new EmployeeAssignedToLocationEvent(this.id, this._locationID, employeeID));
    }

    public removeEmployee(employeeID: number): void {
        this._employees.splice(this._employees.indexOf(employeeID), 1);
        this.applyChange(new EmployeeRemovedFromLocationEvent(this.id, this._locationID, employeeID));
    }
}