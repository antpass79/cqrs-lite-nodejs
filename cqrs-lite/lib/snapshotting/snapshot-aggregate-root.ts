import { Snapshot } from "./snapshot";
import { AggregateRoot } from "../domain/aggregate-root";

export abstract class SnapshotAggregateRoot<T extends Snapshot> extends AggregateRoot {

    getSnapshot(): T {
        let snapshot: T = this.createSnapshot();
        snapshot.id = this.id;

        return snapshot;
    }

    restore(snapshot: T) {
        this._id = snapshot.id;
        this._version = snapshot.version;

        this.restoreFromSnapshot(snapshot);
    }

    protected abstract createSnapshot(): T;
    protected abstract restoreFromSnapshot(snapshot: T): void;
}