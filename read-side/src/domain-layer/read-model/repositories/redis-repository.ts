import { RedisClient } from "redis";

// export class RedisRepository {
//     private readonly _redisConnection: IConnectionMultiplexer;

//     /// <summary>
//     /// The Namespace is the first part of any key created by this Repository, e.g. "location" or "employee"
//     /// </summary>
//     private readonly _namespace: string;

//     constructor(redis: IConnectionMultiplexer, namespace: string) {
//         this._redisConnection = redis;
//         this._namespace = namespace;
//     }

//     public get<T>(id: number): T {
//         return this.get<T>(id.toString());
//     }

//     public get<T>(keySuffix: string): T {
//         var key = this.makeKey(keySuffix);
//         var database = this._redisConnection.GetDatabase();

//         var serializedObject = database.StringGet(key);
//         if (serializedObject.IsNullOrEmpty)
//             throw new Error(); //Throw a better exception than this, please

//         return JsonConvert.DeserializeObject<T>(serializedObject.ToString());
//     }

//     public List<T> GetMultiple<T>(List<int> ids)
//     {
//         var database = _redisConnection.GetDatabase();
//         List<RedisKey> keys = new List<RedisKey>();
//         foreach (int id in ids)
//         {
//             keys.Add(MakeKey(id));
//         }
//         var serializedItems = database.StringGet(keys.ToArray(), CommandFlags.None);
//         List<T> items = new List<T>();
//         foreach (var item in serializedItems)
//         {
//             items.Add(JsonConvert.DeserializeObject<T>(item.ToString()));
//         }
//         return items;
//     }

//     public exists(id: number): boolean {
//         return this.exists(id.ToString());
//     }

//     public exists(keySuffix: string): boolean {
//         var key = this.makeKey(keySuffix);
export class RedisRepository {
    private readonly _redis: RedisClient;

    /// <summary>
    /// The Namespace is the first part of any key created by this Repository, e.g. "location" or "employee"
    /// </summary>
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

        const keySuffix = key.toString();

        let madeKey = this.makeKey(keySuffix);

        return new Promise<T>((resolve, reject) => {
            this._redis.get(madeKey, (error, value) => {
                if (!value) {
                    reject(`item is null for the key ${madeKey}`);
                }
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

        // let serializedItems: [] = database.StringGet(Array.from(keys), CommandFlags.None);
        // let items: T[] = [];
        // serializedItems.forEach(item => {
        //     items.push(JsonConvert.DeserializeObject<T>(item.toString()));
        // });

        // return items;
    }

    async exists(keySuffix: number | string): Promise<boolean> {

        keySuffix = keySuffix.toString();
        let madeKey = this.makeKey(keySuffix);

        return new Promise<boolean>((resolve, reject) => {
            this._redis.get(madeKey, (error, value) => {
                resolve(!!value);
            });
        });

        // let database = _redisConnection.GetDatabase();
        // let serializedObject = database.StringGet(key);
        // return !serializedObject.IsNullOrEmpty;
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

        // let database = _redisConnection.GetDatabase();
        // database.StringSet(this.makeKey(key), JsonConvert.SerializeObject(entity));
    }

    private makeKey(key: number | string): string {

        const keySuffix: string = key.toString();
        if (!keySuffix.startsWith(this._namespace + ":")) {
            return this._namespace + ":" + keySuffix;
        }
        else return keySuffix; //Key is already suffixed with namespace
    }
}