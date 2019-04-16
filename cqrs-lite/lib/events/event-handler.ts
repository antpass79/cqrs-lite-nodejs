import { IEvent } from "./event";
import { IHandler } from "../messages/handler";

export interface IEventHandler<T extends IEvent> extends IHandler<T> {    
}