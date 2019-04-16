export class ConcurrencyException extends Error
{
    constructor(id: any) {
        super('A different version than expected was found in aggregate ${id}');
    }
}