import { AggregateRoot } from "./aggregate-root";
import { IRepository } from "./repository";
import { ConcurrencyException } from "./exceptions/concurrency-exception";

class AggregateDescriptor
{
    aggregate: AggregateRoot;
    version: number;

    constructor(aggregate: AggregateRoot, version: number) {
        this.aggregate = aggregate;
        this.version = version;
    }
}

export interface ISession {
    add<T extends AggregateRoot>(aggregate: T): void;
    get<T extends AggregateRoot>(id: any, expectedVersion?: number): T;
    commit(): void;
}

export class Session implements ISession
{
    private readonly _repository: IRepository;
    private readonly _trackedAggregates: Map<any, AggregateDescriptor>;

    constructor(repository: IRepository)
    {
        if(repository == null)
            throw new Error("repository is null");

        this._repository = repository;
        this._trackedAggregates = new Map<any, AggregateDescriptor>();
    }

    add<T extends AggregateRoot>(aggregate: T): void
    {
        if (!this.isTracked(aggregate.id))
            this._trackedAggregates.set(aggregate.id, new AggregateDescriptor(aggregate, aggregate.version));
        else if (this._trackedAggregates.get(aggregate.id).aggregate != aggregate)
            throw new ConcurrencyException(aggregate.id);
    }

    public get<T extends AggregateRoot>(aggregateType: { new(): T }, id: any, expectedVersion?: number): T
    {
        if(this.isTracked(id))
        {
            var trackedAggregate = this._trackedAggregates.get(id).aggregate as T;
            if (expectedVersion != null && trackedAggregate.version != expectedVersion)
                throw new ConcurrencyException(trackedAggregate.id);
            return trackedAggregate;
        }

        var aggregate = this._repository.get<T>(aggregateType, id);
        if (expectedVersion != null && aggregate.version != expectedVersion)
            throw new ConcurrencyException(id);
        this.add(aggregate);

        return aggregate;
    }

    private isTracked(id: any): boolean
    {
        return this._trackedAggregates.has(id);
    }

    public commit(): void
    {
        Array.from(this._trackedAggregates.values()).forEach(descriptor => {
            this._repository.save(descriptor.aggregate, descriptor.version);
        });

        this._trackedAggregates.clear();
    }
}