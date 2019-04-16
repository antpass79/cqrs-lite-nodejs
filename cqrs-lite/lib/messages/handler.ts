import { IMessage } from "./message";

export interface IHandler<T extends IMessage> {
    handle(message: T): void;
}