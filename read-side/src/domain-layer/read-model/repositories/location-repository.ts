import { IBaseRepository } from "./base-repository";
import { EmployeeRM } from "../employee-rm";
import { LocationRM } from "../location-rm";
import { RedisRepository } from "./redis-repository";

export interface ILocationRepository extends IBaseRepository<LocationRM> {
    getAll(): Promise<LocationRM[]>;
    getEmployees(locationID: number): Promise<EmployeeRM[]>;
    hasEmployee(locationID: number, employeeID: number): Promise<boolean>;
}

export class LocationRepository extends RedisRepository implements ILocationRepository 
{
    constructor() {
        super("location");
    }

    async getByID(locationID: number): Promise<LocationRM> {
        return super.get<LocationRM>(locationID);
    }

    async getMultiple(locationIDs: number[]): Promise<LocationRM[]> {
        return this.getMultipleBase(locationIDs);
    }

    async hasEmployee(locationID: number, employeeID: number): Promise<boolean> {
        //Deserialize the LocationDTO with the key location:{locationID}
        let location = super.get<LocationRM>(locationID);

        //If that location has the specified Employee, return true
        return (await location).employees.indexOf(employeeID) != 0;
    }

    async getAll(): Promise<LocationRM[]> {
        return super.get<LocationRM[]>("all");
    }

    async getEmployees(locationID: number): Promise<EmployeeRM[]> {
        return super.get<EmployeeRM[]>(locationID.toString() + ":employees");
    }

    async save(location: LocationRM): Promise<boolean> {
        await super.saveBase(location.locationID, location);
        return this.mergeIntoAllCollection(location);
    }

    private async mergeIntoAllCollection(location: LocationRM): Promise<boolean> {
        let allLocations: LocationRM[] = [];
        if (await this.exists("all")) {
            allLocations = await super.get<LocationRM[]>("all");
        }

        //If the district already exists in the ALL collection, remove that entry
        if (allLocations.filter(x => x.locationID == location.locationID).length > 0) {
            let locationToRemove = allLocations.find(x => x.locationID == location.locationID);
            allLocations.splice(allLocations.indexOf(locationToRemove), 1);
        }

        //Add the modified district to the ALL collection
        allLocations.push(location);

        return super.saveBase("all", allLocations);
    }
}