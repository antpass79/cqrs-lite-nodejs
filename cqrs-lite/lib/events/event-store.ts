import { IEvent } from "./event";

export interface IEventStore {
    save(events: IEvent[]): void;
    get(aggregateId: any, fromVersion: number): IEvent[];
}