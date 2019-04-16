import { RedisClient } from "redis";

export class RedisRepository {

    private readonly _redis: RedisClient;
    private readonly _namespace: string;

    constructor(namespace: string) {
        this._redis = new RedisClient({
            host: '127.0.0.1',
            port: 6379
        });

        this._namespace = namespace;

        this._redis.on('connect', () => {
            console.log('Redis connected with namespace: ' + namespace);
        });
    }

    async get<T>(key: number | string): Promise<T> {

        const keySuffix = key ? key.toString() : -1;
        let madeKey = this.makeKey(keySuffix);

        return new Promise<T>((resolve, reject) => {
            this._redis.get(madeKey, (error, value) => {
                if (!value)
                    reject(`item is null for the key ${madeKey}`);
                else {
                    let entity: T = JSON.parse(value);
                    resolve(entity);
                }
            });
        });
    }

    async getMultipleBase<T>(ids: number[]): Promise<T[]> {

        let promises: Promise<any>[] = [];
        ids.forEach(id => {
            promises.push(this.get(id));
        });

        return Promise.all(promises);
    }

    async exists(keySuffix: number | string): Promise<boolean> {

        keySuffix = keySuffix ? keySuffix.toString() : -1;
        let madeKey = this.makeKey(keySuffix);

        return new Promise<boolean>((resolve, reject) => {
            this._redis.get(madeKey, (error, value) => {
                resolve(!!value);
            });
        });
    }

    public saveBase(keySuffix: number | string, entity: any): Promise<boolean> {

        keySuffix = keySuffix.toString();
        let madeKey = this.makeKey(keySuffix);

        return new Promise<any>((resolve, reject) => {

            let json = JSON.stringify(entity);
            this._redis.set(madeKey, json, (error, value) => {
                resolve(!error);
            });
        });
    }

    private makeKey(key: number | string): string {

        const keySuffix: string = key.toString();
        if (!keySuffix.startsWith(this._namespace + ":")) {
            return this._namespace + ":" + keySuffix;
        }
        else return keySuffix; //Key is already suffixed with namespace
    }
}