import { ILocationRepository } from "../domain-layer/write-model/repositories/location-repository";
import { IValidator } from "./validator";

export class CreateLocationRequest {
    locationID: any;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
}

export class CreateLocationRequestValidator implements IValidator<CreateLocationRequest> {

    constructor(private locationRepository: ILocationRepository) {        
    }

    async validate(item: CreateLocationRequest): Promise<boolean> {
        if (!item)
            return Promise.resolve<boolean>(false);

        let locationExists = await this.locationRepository.exists(item.locationID);
        let streetAddressExists = !!item.streetAddress;
        let cityExists = !!item.city;
        let stateExists = !!item.state;
        let postalCodeExists = !!item.postalCode;

        let valid: boolean = !locationExists && streetAddressExists && cityExists && stateExists && postalCodeExists;
        return Promise.resolve<boolean>(valid);
    }
}