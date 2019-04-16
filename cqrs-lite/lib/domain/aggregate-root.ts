import { IEvent } from "../events/event";
import { EventsOutOfOrderException } from "./exceptions/events-out-of-order-exception";

export abstract class AggregateRoot {
    private readonly _changes: IEvent[] = [];

    protected _id: any;
    get id() {
        return this._id;
    }

    protected _version: number;
    get version() {
        return this._version;
    }

    constructor() {
        this._version = 0;
    }

    getUncommittedChanges(): IEvent[] {
        return [...this._changes];
    }

    markChangesAsCommitted(): void {
        this._version = this.version + this._changes.length;
        this._changes.splice(0, this._changes.length);
    }

    loadFromHistory(history: IEvent[]) {
        history.forEach(item => {
            if (item.version != this.version + 1)
                throw new EventsOutOfOrderException(item.id);

            this.internalApplyChange(item, false);
        });
    }

    protected applyChange(event: IEvent): void {
        this.internalApplyChange(event, true);
    }

    private internalApplyChange(event: IEvent, isNew: boolean): void {
        if (isNew) {
            this._changes.push(event);
        }
        else {
            this._id = event.id;
            this._version++;
        }
    }
}