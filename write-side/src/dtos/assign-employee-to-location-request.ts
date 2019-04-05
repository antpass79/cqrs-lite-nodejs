import { IValidator } from "./validator";
import { IEmployeeRepository } from "../domain-layer/write-model/repositories/employee-repository";
import { ILocationRepository } from "../domain-layer/write-model/repositories/location-repository";

export class AssignEmployeeToLocationRequest {    
    employeeID: any;
    locationID: any;
}

export class AssignEmployeeToLocationRequestValidator implements IValidator<AssignEmployeeToLocationRequest> {

    constructor(private employeeRepository: IEmployeeRepository, private locationRepository: ILocationRepository) {
    }

    async validate(item: AssignEmployeeToLocationRequest): Promise<boolean> {        
        if (!item)
            return Promise.resolve<boolean>(false);

        let employeeExists = await this.employeeRepository.exists(item.employeeID);
        let locationExists = await this.locationRepository.exists(item.locationID);
        let hasEmployee = await this.locationRepository.hasEmployee(item.locationID, item.employeeID);

        let valid: boolean = employeeExists && locationExists && hasEmployee;
        return Promise.resolve<boolean>(valid);
    }
}