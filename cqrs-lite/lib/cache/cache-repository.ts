import { IRepository } from "../domain/repository";
import { IEventStore } from "../events/event-store";
import { MemoryCache } from "./memory-cache";
import { AggregateRoot } from "../domain/aggregate-root";

export class CacheRepository implements IRepository {
    private readonly _repository: IRepository;
    private readonly _eventStore: IEventStore;
    private readonly _cache: MemoryCache;
    private readonly _policyFactory = new Date(0, 0, 15, 0);

    constructor(repository: IRepository, eventStore: IEventStore) {
        if (repository == null)
            throw new Error("repository is null");
        if (eventStore == null)
            throw new Error("eventStore is null");

        this._repository = repository;
        this._eventStore = eventStore;
        this._cache = MemoryCache.default;
    }

    public save<T extends AggregateRoot>(aggregate: T, expectedVersion?: number): void {
        var idstring = aggregate.id.toString();
        try {
            if (aggregate.id && !this.isTracked(aggregate.id))
                this._cache.add(idstring, aggregate);
            this._repository.save(aggregate, expectedVersion);
        }
        catch (error) {
            this._cache.remove(idstring);
            throw error;
        }
    }

    public get<T extends AggregateRoot>(aggregateType: { new(): T }, aggregateId: any): T {
        var idstring = aggregateId.toString();
        try {
            let aggregate: T;
            if (this.isTracked(aggregateId)) {
                aggregate = this._cache.get<T>(idstring);
                var events = this._eventStore.get(aggregateId, aggregate.version);
                if (events.length > 0 && events[0].version != aggregate.version + 1) {
                    this._cache.remove(idstring);
                }
                else {
                    aggregate.loadFromHistory(events);
                    return aggregate;
                }
            }

            aggregate = this._repository.get<T>(aggregateType, aggregateId);
            this._cache.add(
                aggregateId.toString(),
                aggregate,
                this._policyFactory.getDate());
            return aggregate;
        }
        catch (error) {
            this._cache.remove(idstring);
            throw error;
        }
    }

    private isTracked(id: any): boolean {
        return this._cache.contains(id.toString());
    }
}