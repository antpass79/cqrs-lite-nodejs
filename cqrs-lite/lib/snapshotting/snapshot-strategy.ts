import { AggregateRoot } from "../domain/aggregate-root";
import { SnapshotAggregateRoot } from "./snapshot-aggregate-root";

export interface ISnapshotStrategy {

    shouldMakeSnapshot(aggregate: AggregateRoot): boolean;
    isSnapshotable(aggregate: AggregateRoot): boolean;
}

export class DefaultSnapshotStrategy implements ISnapshotStrategy {

    private snapshotInterval: number = 100;

    isSnapshotable(aggregate: AggregateRoot): boolean {
        return aggregate instanceof SnapshotAggregateRoot;
    }

    shouldMakeSnapshot(aggregate: AggregateRoot): boolean {
        if (!this.isSnapshotable(aggregate))
            return false;

        let i = aggregate.version;
        for (let j = 0; j < aggregate.getUncommittedChanges().length; j++)
            if (++i % this.snapshotInterval == 0 && i != 0)
                return true;
        return false;
    }
}