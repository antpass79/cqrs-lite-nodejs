export interface Location {
    locationID: any;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    employees?: any[];
    aggregateID?: any;
}

export function initialLocation(): Location {

    return {
        locationID: undefined,
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        employees: [],
        aggregateID: undefined
    };
}