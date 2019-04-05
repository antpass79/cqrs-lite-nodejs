export interface IValidator<T> {
    validate(item: T): Promise<boolean>;
}