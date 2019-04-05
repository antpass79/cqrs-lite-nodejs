export interface IBaseRepository<T> {
    getByID(id: number): Promise<T>;
    getMultiple(ids: number[]): Promise<T[]>;
    exists(id: number): Promise<boolean>;
    save(item: T): Promise<boolean>;
}