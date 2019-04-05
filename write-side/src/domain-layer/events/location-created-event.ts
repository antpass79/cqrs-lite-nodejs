import { BaseEvent } from "./base-event";

export class LocationCreatedEvent extends BaseEvent {
    readonly locationID: any;
    readonly streetAddress: string;
    readonly city: string;
    readonly state: string;
    readonly postalCode: string;

    constructor(id: any, locationID: any, streetAddress: string, city: string, state: string, postalCode: string) {
        super();

        this.id = id;
        this.locationID = locationID;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
    }
}