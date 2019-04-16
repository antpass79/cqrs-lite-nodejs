import { IMessage } from "../messages/message";

export interface IHandlerRegistrar {
    registerHandler<T extends IMessage>(type: string, action: (param: T) => void): void;
}