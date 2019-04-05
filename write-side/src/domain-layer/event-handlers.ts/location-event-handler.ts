import { IEventHandler } from "cqrs-lite";
import { LocationCreatedEvent } from "../events/location-created-event";
import { EmployeeAssignedToLocationEvent } from "../events/employee-assigned-to-location-event";
import { EmployeeRemovedFromLocationEvent } from "../events/employee-removed-from-location-event";
import { LocationWM } from "../write-model/location-wm";
import { ILocationRepository } from "../write-model/repositories/location-repository";
import { IEmployeeRepository } from "../write-model/repositories/employee-repository";
import { AutoMapper } from "automapper-ts-node";

export class LocationEventHandler implements
    IEventHandler<LocationCreatedEvent>,
    IEventHandler<EmployeeAssignedToLocationEvent>,
    IEventHandler<EmployeeRemovedFromLocationEvent> {

    private readonly _mapper: AutoMapper;
    private readonly _locationRepo: ILocationRepository;
    private readonly _employeeRepo: IEmployeeRepository;

    constructor(mapper: AutoMapper, locationRepo: ILocationRepository, employeeRepo: IEmployeeRepository) {
        this._mapper = mapper;
        this._locationRepo = locationRepo;
        this._employeeRepo = employeeRepo;
    }

    async handle(message: LocationCreatedEvent | EmployeeAssignedToLocationEvent | EmployeeRemovedFromLocationEvent): Promise<boolean> {

        let result = true;

        if (message instanceof LocationCreatedEvent) {
            let location: LocationWM = this._mapper.map('LocationCreatedEvent', 'LocationWM', message);
            this._locationRepo.save(location);
        }
        else if (message instanceof EmployeeAssignedToLocationEvent) {
            var location = await this._locationRepo.getByID(message.newLocationID);
            (await location).employees.push(message.employeeID);
            this._locationRepo.save(location);

            //Find the employee which was assigned to this Location
            var employee = await this._employeeRepo.getByID(message.employeeID);
            employee.locationID = message.newLocationID;
            this._employeeRepo.save(employee);
        }
        else if (message instanceof EmployeeRemovedFromLocationEvent) {
            var location = await this._locationRepo.getByID(message.oldLocationID);
            location.employees.splice(location.employees.indexOf(message.employeeID), 1);
            this._locationRepo.save(location);
        }
        else
            result = false;

        return new Promise<boolean>((resolve, reject) => {
            resolve(result);
        });
    }

    // handle(message: LocationCreatedEvent): void {
    //     let location: LocationRM = this._mapper.Map<LocationRM>(message);
    //     this._locationRepo.save(location);
    // }

    // handle(message: EmployeeAssignedToLocationEvent): void {
    //     var location = this._locationRepo.getByID(message.newLocationID);
    //     location.employees.push(message.employeeID);
    //     this._locationRepo.save(location);

    //     //Find the employee which was assigned to this Location
    //     var employee = this._employeeRepo.getByID(message.employeeID);
    //     employee.locationID = message.newLocationID;
    //     this._employeeRepo.save(employee);
    // }

    // handle(message: EmployeeRemovedFromLocationEvent): void {
    //     var location = this._locationRepo.getByID(message.oldLocationID);
    //     location.employees.splice(location.employees.indexOf(message.employeeID), 1);
    //     this._locationRepo.save(location);
    // }
}