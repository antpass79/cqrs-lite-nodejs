import { ILocationRepository } from "../../domain-layer/read-model/repositories/location-repository";
import { LocationRM } from "../../domain-layer/read-model/location-rm";
import { EmployeeRM } from "../../domain-layer/read-model/employee-rm";

export class LocationController {

    constructor(private locationRepository: ILocationRepository) {
    }

    async getByID(req: any, res: any) {

        try {
            let id: any = req.body.locationID;
            let location: LocationRM = await this.locationRepository.getByID(id);
            if (location)
                res.send(location);
            else
                res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async getAll(req: any, res: any) {

        try {
            let locations: LocationRM[] = await this.locationRepository.getAll();
            res.send(locations);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }

    async getEmployees(req: any, res: any) {

        try {
            let id: any = req.body.locationID;
            let employees: EmployeeRM[] = await this.locationRepository.getEmployees(id);
            res.send(employees);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}