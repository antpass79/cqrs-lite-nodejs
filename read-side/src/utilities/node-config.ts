import fs from 'fs';
import path from 'path';

export class NodeConfig {

    // data members

    private _json: any;

    // constructor

    constructor() {

        let configurationPath = path.join(__dirname, '../assets/config.json');
        this._json = this.readConfig(configurationPath);
    }

    // public functions

    getValue(key: string) {

        return process.env[key] || this._json[key];
    }

    // private functions

    private readConfig(configurationPath: string) {

        let buffer = fs.readFileSync(configurationPath, {encoding: 'utf-8'});
        let jsonBuffer = buffer.toString();
        let jsonData = JSON.parse(jsonBuffer);

        return jsonData;
    }
}