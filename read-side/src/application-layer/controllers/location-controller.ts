import { ILocationRepository, LocationM, EmployeeM } from "cqrs-lite-common";

export class LocationController {

    constructor(private locationRepository: ILocationRepository) {
    }

    async getByID(req: any, res: any) {

        try {
            let id: any = req.body.locationID;
            let location: LocationM = await this.locationRepository.getByID(id);
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
            let locations: LocationM[] = await this.locationRepository.getAll();
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
            let employees: EmployeeM[] = await this.locationRepository.getEmployees(id);
            res.send(employees);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}