import * as express from "express";
import { LocationController } from "../controllers/location-controller";
import { ICommunicationConfiguration } from "../communication-configuration";

export class LocationRoute {

    private locationController: LocationController;

    constructor(communicationConfiguration: ICommunicationConfiguration) {
        this.locationController = new LocationController(communicationConfiguration.bus, communicationConfiguration.autoMapper, communicationConfiguration.locationRepository, communicationConfiguration.employeeRepository);
    }

    initRoute(): express.Router {

        const router = express.Router()
        router.post('/create', (req, res) => this.locationController.create(req, res));
        router.post('/assignEmployee', (req, res) => this.locationController.assignEmployee(req, res));

        return router;
    }
}
