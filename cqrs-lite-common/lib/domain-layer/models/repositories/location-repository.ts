import { IBaseRepository } from "./base-repository";
import { EmployeeM } from "../employee-m";
import { LocationM } from "../location-m";
import { RedisRepository } from "./redis-repository";

export interface ILocationRepository extends IBaseRepository<LocationM> {
    getAll(): Promise<LocationM[]>;
    getEmployees(locationID: number): Promise<EmployeeM[]>;
    hasEmployee(locationID: number, employeeID: number): Promise<boolean>;
}

export class LocationRepository extends RedisRepository implements ILocationRepository {
    
    constructor() {
        super("location");
    }

    async getByID(locationID: number): Promise<LocationM> {
        return super.get<LocationM>(locationID);
    }

    async getMultiple(locationIDs: number[]): Promise<LocationM[]> {
        return this.getMultipleBase(locationIDs);
    }

    async hasEmployee(locationID: number, employeeID: number): Promise<boolean> {
        //Deserialize the LocationDTO with the key location:{locationID}
        let location = super.get<LocationM>(locationID);

        //If that location has the specified Employee, return true
        return (await location).employees.indexOf(employeeID) != 0;
    }

    async getAll(): Promise<LocationM[]> {
        return super.get<LocationM[]>("all");
    }

    async getEmployees(locationID: number): Promise<EmployeeM[]> {
        return super.get<EmployeeM[]>(locationID.toString() + ":employees");
    }

    async save(location: LocationM): Promise<boolean> {

        let promises: Promise<any>[] = [super.saveBase(location.locationID, location), this.mergeIntoAllCollection(location)];
        await Promise.all(promises);
        console.log(`LocationRepository.save -> saveBase location AggregateID ${location.aggregateID}, ${location.city} ${location.streetAddress}`);
        return Promise.resolve(true);
    }

    private async mergeIntoAllCollection(location: LocationM): Promise<boolean> {
        let allLocations: LocationM[] = [];
        if (await this.exists("all")) {
            allLocations = await super.get<LocationM[]>("all");
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