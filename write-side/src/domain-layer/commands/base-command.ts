import { ICommand } from 'cqrs-lite';

export class BaseCommand implements ICommand {
    id: any;
    expectedVersion: number = 0;
}