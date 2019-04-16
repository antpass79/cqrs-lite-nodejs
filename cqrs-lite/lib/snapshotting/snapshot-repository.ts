import { IRepository } from "../domain/repository";
import { ISnapshotStore, CancellationToken, createCancellationToken } from "./snapshot-store";
import { ISnapshotStrategy } from "./snapshot-strategy";
import { IEventStore } from "../events/event-store";
import { AggregateRoot } from "../domain/aggregate-root";
import { AggregateFactory } from "../domain/factories/aggregate-factory";
import { SnapshotAggregateRoot } from "./snapshot-aggregate-root";

export class SnapshotRepository {
// export class SnapshotRepository implements IRepository {

    private readonly _snapshotStore: ISnapshotStore;
    private readonly _snapshotStrategy: ISnapshotStrategy;
    private readonly _repository: IRepository;
    private readonly _eventStore: IEventStore;

    constructor(snapshotStore: ISnapshotStore, snapshotStrategy: ISnapshotStrategy, repository: IRepository, eventStore: IEventStore) {
        if (!snapshotStore)
            throw new Error("snapshotStore");
        if (!snapshotStrategy)
            throw new Error("snapshotStrategy");
        if (!repository)
            throw new Error("repository");
        if (!eventStore)
            throw new Error("eventStore");

        this._snapshotStore = snapshotStore;
        this._snapshotStrategy = snapshotStrategy;
        this._repository = repository;
        this._eventStore = eventStore;
    }

    save<T extends AggregateRoot>(aggregate: T, exectedVersion?: number, cancellationToken?: CancellationToken): Promise<any> {
        if (!cancellationToken)
            cancellationToken = createCancellationToken();

            // return Task.WhenAll(TryMakeSnapshot(aggregate), this._repository.save(aggregate, exectedVersion, cancellationToken));
        let promise1 = this.tryMakeSnapshot(aggregate);
        let promise2 = Promise.resolve(this._repository.save(aggregate, exectedVersion));
        return Promise.all([promise1, promise2]);
    }

    public async get<T extends AggregateRoot>(agggregateType: any, aggregateId: any, cancellationToken?: CancellationToken): Promise<T> {
        if (!cancellationToken)
            cancellationToken = createCancellationToken();

        let aggregate: T = AggregateFactory.createAggregate<T>(agggregateType);
        let snapshotVersion = await this.tryRestoreAggregateFromSnapshot(aggregateId, aggregate, cancellationToken);
        if (snapshotVersion == -1)
            return await this._repository.get<T>(agggregateType, aggregateId);
            // return await this._repository.get<T>(aggregateId, cancellationToken);

        // var events = (await _eventStore.Get(aggregateId, snapshotVersion, cancellationToken).ConfigureAwait(false))
        var events = await this._eventStore.get(aggregateId, snapshotVersion);
        let filteredEvents = events.filter(desc => desc.version > snapshotVersion);
        aggregate.loadFromHistory(filteredEvents);

        return Promise.resolve<T>(aggregate);
    }

    private async tryRestoreAggregateFromSnapshot<T extends AggregateRoot>(id: any, aggregate: T, cancellationToken?: CancellationToken): Promise<number> {
        if (!this._snapshotStrategy.isSnapshotable(aggregate))
            return -1;
        var snapshot = await this._snapshotStore.get(id, cancellationToken);
        if (snapshot == null)
            return -1;

        let snapshotAggregateRoot: SnapshotAggregateRoot<any> = (aggregate as any) as SnapshotAggregateRoot<any>;
        snapshotAggregateRoot.restore(snapshot);
        return snapshot.version;
    }

    private tryMakeSnapshot(aggregate: AggregateRoot): Promise<void> {
        if (!this._snapshotStrategy.shouldMakeSnapshot(aggregate))
            return Promise.resolve();

        let snapshot = (aggregate as SnapshotAggregateRoot<any>).getSnapshot();
        snapshot.version = aggregate.version + aggregate.getUncommittedChanges().length;
        return this._snapshotStore.save(snapshot, null);
    }
}