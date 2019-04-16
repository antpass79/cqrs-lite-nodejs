export class MissingParameterLessConstructorException extends Error
{
    constructor(type: any) {
        super('${type} has no constructor without paramerters. This can be either public or private');
    }
}