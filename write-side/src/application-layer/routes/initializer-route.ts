import * as express from "express";
import { InitializerController } from "../controllers/initializer-controller";
import { ICommunicationConfiguration } from "../communication-configuration";

export class InitializerRoute {

    private initializerController: InitializerController;

    constructor(communicationConfiguration: ICommunicationConfiguration) {
        this.initializerController = new InitializerController(communicationConfiguration.bus, communicationConfiguration.autoMapper, communicationConfiguration.locationRepository);
    }

    initRoute(): express.Router {

        const router = express.Router()
        router.post('/init', (req, res) => this.initializerController.init(req, res));

        return router;
    }
}
