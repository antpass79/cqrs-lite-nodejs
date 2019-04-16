export class EventsOutOfOrderException extends Error
{
    constructor(id: any) {
        super('Eventstore gave event for aggregate ${id} out of order');
    }
}