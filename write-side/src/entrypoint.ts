import { Server } from './server';
import { NodeConfig } from './utilities/node-config';

let nodeConfig = new NodeConfig();

const port = process.env.LISTEN_PORT || nodeConfig.getValue('LISTEN_PORT');

let server = new Server(port);
server.start();