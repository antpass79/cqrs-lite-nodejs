import { Employee } from "../models/employee";

export class InitializerService {

    private _serverInitRoot: string = 'http://localhost:4000/initialize/';

    async init() {
        const response = await fetch(this._serverInitRoot + 'init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        return await response;
    }
}