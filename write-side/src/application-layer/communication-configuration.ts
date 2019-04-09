import express = require("express");
import { InProcessBus } from "cqrs-lite";
import { AutoMapper } from "automapper-ts-node";
import { ILocationRepository, IEmployeeRepository } from "cqrs-lite-common";

export interface ICommunicationConfiguration {
    app: express.Application;
    bus: InProcessBus;
    autoMapper: AutoMapper;
    employeeRepository: IEmployeeRepository;
    locationRepository: ILocationRepository;
}