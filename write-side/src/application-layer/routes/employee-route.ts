import * as express from "express";
import { EmployeeController } from "../controllers/employee-controller";
import { ICommunicationConfiguration } from "../communication-configuration";

export class EmployeeRoute {

    private employeeController: EmployeeController;

    constructor(communicationConfiguration: ICommunicationConfiguration) {
        this.employeeController = new EmployeeController(communicationConfiguration.bus, communicationConfiguration.autoMapper, communicationConfiguration.employeeRepository, communicationConfiguration.locationRepository);
    }

    initRoute(): express.Router {

        const router = express.Router()
        router.post('/create', (req, res) => this.employeeController.create(req, res));

        return router;
    }
}
