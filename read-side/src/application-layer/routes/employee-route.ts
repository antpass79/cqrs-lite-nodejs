import * as express from "express";
import { ICommunicationConfiguration } from "../communication-configuration";
import { EmployeeController } from "../controllers/employee-controller";

export class EmployeeRoute {

    private employeeController: EmployeeController;

    constructor(communicationConfiguration: ICommunicationConfiguration) {
        this.employeeController = new EmployeeController(communicationConfiguration.employeeRepository);
    }

    initRoute(): express.Router {

        const router = express.Router()
        router.get('/getbyid', (req, res) => this.employeeController.getByID(req, res));
        router.get('/getall', (req, res) => this.employeeController.getAll(req, res));

        return router;
    }
}
