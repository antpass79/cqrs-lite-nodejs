import { ICommand } from "./command";
import { IHandler } from "../messages/handler";

export interface ICommandHandler<T extends ICommand> extends IHandler<T> {
}