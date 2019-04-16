import { AggregateRoot } from "../aggregate-root";

export class AggregateFactory
{
    public static createAggregate<T extends AggregateRoot>(creator: { new(): T }): T
    {
        try
        {
            return new creator();
        }
        catch (MissingMethodException)
        {
            throw new Error();
//            throw new MissingParameterLessConstructorException(typeof(T));
        }
    }
}