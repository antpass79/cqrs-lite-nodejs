import { Cache } from 'memory-cache';

export class MemoryCache {

    private static _defaultCache = new MemoryCache();

    private _cache = new Cache();

    static get default() {
        return MemoryCache._defaultCache;
    }

    add(key: string, item: any, time?: number): void {

        this._cache.put(key, item, time);
    }

    contains(key: string) {
        return !!this._cache.get(key);
    }

    get<T>(key: string): T {
        return this._cache.get(key) as T;
    }

    remove(key: string): void {
        this._cache.del(key);
    }
}