import * as express from "express";
import { ICommunicationConfiguration } from "../communication-configuration";
import { LocationController } from "../controllers/location-controller";

export class LocationRoute {

    private locationController: LocationController;

    constructor(communicationConfiguration: ICommunicationConfiguration) {
        this.locationController = new LocationController(communicationConfiguration.locationRepository);
    }

    initRoute(): express.Router {

        const router = express.Router()
        router.get('/getbyid', (req, res) => this.locationController.getByID(req, res));
        router.get('/getall', (req, res) => this.locationController.getAll(req, res));
        router.get('/getemployees', (req, res) => this.locationController.getEmployees(req, res));

        return router;
    }
}
