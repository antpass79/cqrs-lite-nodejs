import { IEventPublisher } from "../events/event-publisher";
import { AggregateRoot } from "./aggregate-root";
import { IEventStore } from "../events/event-store";
import { ConcurrencyException } from "./exceptions/concurrency-exception";
import { AggregateOrEventMissingIdException } from "./exceptions/aggregate-or-event-missing-id-exception";
import { AggregateNotFoundException } from "./exceptions/aggregate-not-found-exception";
import { AggregateFactory } from "./factories/aggregate-factory";

export interface IRepository {
    save<T extends AggregateRoot>(aggregate: T, expectedVersion?: number): void;
    get<T extends AggregateRoot>(aggregateType: { new(): T }, aggregateId: any): T;
}

export class Repository implements IRepository
{
    private readonly _eventStore: IEventStore;

    public constructor(eventStore: IEventStore)
    {
        if(eventStore == null)
            throw new Error("eventStore is null");
        this._eventStore = eventStore;
    }

    public save<T extends AggregateRoot>(aggregate: T, expectedVersion?: number): void
    {
        if (expectedVersion && this._eventStore.get(
                aggregate.id, expectedVersion).length > 0)
            throw new ConcurrencyException(aggregate.id);
        
        var i = 0;
        aggregate.getUncommittedChanges().forEach(event => {
            if (!event.id) 
                event.id = aggregate.id;
            if (!event.id)
                throw new AggregateOrEventMissingIdException(
                    aggregate, event);
            i++;
            event.version = aggregate.version + i;            
            event.timestamp = (new Date()).getTime();
            this._eventStore.save([event]);
        });

        aggregate.markChangesAsCommitted();
    }

    public get<T extends AggregateRoot>(aggregateType: { new(): T }, aggregateId: any): T
    {
        return this.loadAggregate<T>(aggregateType, aggregateId);
    }

    private loadAggregate<T extends AggregateRoot>(aggregateType: { new(): T }, id: any): T
    {
        var aggregate = AggregateFactory.createAggregate<T>(aggregateType);

        var events = this._eventStore.get(id, -1);
        if (events.length == 0)
            throw new AggregateNotFoundException(id);

        aggregate.loadFromHistory(events);
        return aggregate;
    }
}