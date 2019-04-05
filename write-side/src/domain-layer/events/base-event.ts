import { IEvent } from "cqrs-lite";

export class BaseEvent implements IEvent {
    id: any;
    version: number = 0;
    timestamp: number = 0;
}