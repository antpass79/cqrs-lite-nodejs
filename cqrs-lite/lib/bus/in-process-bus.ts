import { ICommandSender } from "../commands/command-sender";
import { IEventPublisher } from "../events/event-publisher";
import { IHandlerRegistrar } from "./handler-registrar";
import { IMessage } from "../messages/message";
import { ICommand } from "../commands/command";
import { IEvent } from "../events/event";

export class InProcessBus implements ICommandSender, IEventPublisher, IHandlerRegistrar
{
    private readonly _routes: Map<string, Array<(param: IMessage) => void>>  = new Map<string, Array<(param: IMessage) => void>>();

    public registerHandler<T extends IMessage>(type: string, handler: (param: T) => void): void
    {
        let handlers: Array<(param: IMessage) => void>;
        if (this._routes.has(type))
            handlers = this._routes.get(type);
        else {
            handlers = new Array<(param: IMessage) => void>();
            this._routes.set(type, handlers);
        }

        let castedHandler = handler as (param: IMessage) => void;
        handlers.push(castedHandler);
    }

    public send<T extends ICommand>(command: T): void
    {
        let key = command.constructor.name;
        if (this._routes.has(key)) {
            let handlers: Array<(param: IMessage) => void> = this._routes.get(key);
            if (handlers.length != 1) {
                throw new Error("Cannot send to more than one handler");
            }

            handlers[0](command);
        }
        else {
            throw new Error("No handler registered");
        }
    }

    public publish<T extends IEvent>(event: T): T
    {
        let key = event.constructor.name;
        if (!this._routes.has(key)) {
            return;
        }

        let handlers: Array<(param: IMessage) => void> = this._routes.get(key);
        handlers.forEach(handler => handler(event));        
    }
}