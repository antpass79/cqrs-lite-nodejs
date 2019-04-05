import { IValidator } from "./validator";
import { IEmployeeRepository } from "../domain-layer/write-model/repositories/employee-repository";
import { ILocationRepository } from "../domain-layer/write-model/repositories/location-repository";

export class CreateEmployeeRequest {
    employeeID: any;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    jobTitle: string;
    locationID: any;
}

export class CreateEmployeeRequestValidator implements IValidator<CreateEmployeeRequest> {

    constructor(private employeeRepository: IEmployeeRepository, private locationRepository: ILocationRepository) {        
    }

    async validate(item: CreateEmployeeRequest): Promise<boolean> {
        if (!item)
            return Promise.resolve<boolean>(false);

        let employeeExists = await this.employeeRepository.exists(item.employeeID);
        let locationExists = await this.locationRepository.exists(item.locationID);
        let lastNameExists = !!item.lastName;
        let firstNameExists = !!item.firstName;
        let jobTitleExists = !!item.jobTitle;

        let dateOfBirth = new Date(item.dateOfBirth);
        let dateValid = dateOfBirth && new Date(dateOfBirth.getFullYear() + 18, dateOfBirth.getMonth() - 1, dateOfBirth.getDate()) <= new Date() ? true : false;

        let valid: boolean = !employeeExists && locationExists && lastNameExists && firstNameExists && jobTitleExists && dateValid;
        return Promise.resolve<boolean>(valid);
    }
}