import { IEvent, IEventStore, IEventPublisher } from "cqrs-lite";

export class InMemoryEventStore implements IEventStore {

    private readonly _publisher: IEventPublisher; //Use this to publish events so that event handlers can consume them
    private readonly _inMemoryDb: Map<any, IEvent[]> = new Map<any, IEvent[]>();

    constructor(publisher: IEventPublisher) {
        this._publisher = publisher;
    }

    save<T>(events: IEvent[]): void {

        events.forEach(event => {

            let list: IEvent[];
            if (this._inMemoryDb.has(event.id)) {
                list = this._inMemoryDb.get(event.id);
            }
            else {
                list = [];
                this._inMemoryDb.set(event.id, list);
            }

            list.push(event);
            this._publisher.publish(event);
        });
    }

    public get<T>(aggregateId: any, fromVersion: number): IEvent[] {        
        if (this._inMemoryDb.has(aggregateId)) {
            let events: IEvent[] = this._inMemoryDb.get(aggregateId);
            return events.filter(x => x.version > fromVersion);
        }
        else {
            return [];
        }
    }

}