export class AggregateNotFoundException extends Error
{
    constructor(id: any) {
        super('Aggregate ${id} was not found');
    }
}