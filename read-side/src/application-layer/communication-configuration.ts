import express = require("express");
import { InProcessBus } from "cqrs-lite";
import { AutoMapper } from "automapper-ts-node";
import { IEmployeeRepository } from "../domain-layer/read-model/repositories/employee-repository";
import { ILocationRepository } from "../domain-layer/read-model/repositories/location-repository";

export interface ICommunicationConfiguration {
    app: express.Application;
    bus: InProcessBus;
    autoMapper: AutoMapper;
    employeeRepository: IEmployeeRepository;
    locationRepository: ILocationRepository;
}