import { IBaseRepository } from "./base-repository";
import { EmployeeWM } from "../employee-wm";
import { LocationWM } from "../location-wm";
import { RedisRepository } from "./redis-repository";

export interface ILocationRepository extends IBaseRepository<LocationWM> {
    getAll(): Promise<LocationWM[]>;
    getEmployees(locationID: number): Promise<EmployeeWM[]>;
    hasEmployee(locationID: number, employeeID: number): Promise<boolean>;
}

export class LocationRepository extends RedisRepository implements ILocationRepository {
    
    constructor() {
        super("location");
    }

    async getByID(locationID: number): Promise<LocationWM> {
        return super.get<LocationWM>(locationID);
    }

    async getMultiple(locationIDs: number[]): Promise<LocationWM[]> {
        return this.getMultipleBase(locationIDs);
    }

    async hasEmployee(locationID: number, employeeID: number): Promise<boolean> {
        //Deserialize the LocationDTO with the key location:{locationID}
        let location = super.get<LocationWM>(locationID);

        //If that location has the specified Employee, return true
        return (await location).employees.indexOf(employeeID) != 0;
    }

    async getAll(): Promise<LocationWM[]> {
        return super.get<LocationWM[]>("all");
    }

    async getEmployees(locationID: number): Promise<EmployeeWM[]> {
        return super.get<EmployeeWM[]>(locationID.toString() + ":employees");
    }

    async save(location: LocationWM): Promise<boolean> {

        let promises: Promise<any>[] = [super.saveBase(location.locationID, location), this.mergeIntoAllCollection(location)];
        await Promise.all(promises);
        console.log(`LocationRepository.save -> saveBase location AggregateID ${location.aggregateID}, ${location.city} ${location.streetAddress}`);
        return Promise.resolve(true);
    }

    private async mergeIntoAllCollection(location: LocationWM): Promise<boolean> {
        let allLocations: LocationWM[] = [];
        if (await this.exists("all")) {
            allLocations = await super.get<LocationWM[]>("all");
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