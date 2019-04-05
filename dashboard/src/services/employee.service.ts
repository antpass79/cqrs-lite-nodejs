import { Employee } from "../models/employee";

export class EmployeeService {

    private _serverWriteRoot: string = 'http://localhost:4000/employee/';
    private _serverReadRoot: string = 'http://localhost:5000/employee/';

    async create(employee: Employee) {
        const response = await fetch(this._serverWriteRoot + 'create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employee: employee }),
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