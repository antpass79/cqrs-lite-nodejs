import { Snapshot } from "./snapshot";

export class Token {
    promise: Promise<any>;
    reason: any;
}

export class CancellationToken {
    token: Token;
    cancel: any;
}

export function createCancellationToken(): CancellationToken {

    let cancel: any;
    const token: Token = new Token();    
    token.promise = new Promise(resolve => { 
        cancel = (reason: any) => {
            token.reason = reason;
            resolve(reason);
        };
    });

    return { token, cancel };
}

export interface ISnapshotStore {
    get(id: any, cancellationToken: CancellationToken): Promise<Snapshot>;
    save(snapshot: Snapshot, cancellationToken: CancellationToken): Promise<void>;
}