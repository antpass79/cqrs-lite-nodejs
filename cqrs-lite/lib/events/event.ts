import { IMessage } from "../messages/message";

export interface IEvent extends IMessage {
    id: any;
    version: number;
    timestamp: number;
}