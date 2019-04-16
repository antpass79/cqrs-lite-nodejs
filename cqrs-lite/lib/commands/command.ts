import { IMessage } from "../messages/message";

export interface ICommand extends IMessage {
    id: any;
    expectedVersion: number;
}

export class Command implements ICommand {
    id: any;
    expectedVersion: number;
}