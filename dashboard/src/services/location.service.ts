import { Location } from "../models/location";

export class LocationService {

    private _serverWriteRoot: string = 'http://localhost:4000/location/';
    private _serverReadRoot: string = 'http://localhost:5000/location/';

    async create(location: Location) {
        const response = await fetch(this._serverWriteRoot + 'create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: location }),
        });

        return await response;
    }

    async getByID(id: any) {
        const response = await fetch(this._serverReadRoot + 'getbyid/' + id);
        return await response;
    }

    async getAll() {
        const response = await fetch(this._serverReadRoot + 'getall');
        return await response;
    }
}