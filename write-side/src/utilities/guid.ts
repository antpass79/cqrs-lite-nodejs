import uuid = require("uuid/v4");

export class Guid {

    static newGuid(): any {
        return uuid();
    }
}