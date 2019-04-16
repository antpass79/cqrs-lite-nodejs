import { ClassNameExtractor } from "../../utils/class-name-extractor";
import { AggregateRoot } from "../aggregate-root";
import { IEvent } from "../../events/event";

export class AggregateOrEventMissingIdException extends Error
{
    constructor(aggregate: AggregateRoot, event: IEvent) {

        let aggregateType = ClassNameExtractor.getClassName(aggregate);
        let eventType = ClassNameExtractor.getClassName(event);
        super('An event of type ${aggregateType} was tried to save from ${eventType} but no id where set on either');
    }
}