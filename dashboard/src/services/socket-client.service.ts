import socketClient from 'socket.io-client';

export class SocketClientService {

    private socket: SocketIOClient.Socket;

    constructor(private endpoint: string) {
        this.socket = socketClient(this.endpoint);
    }

    public on(eventName: string, fn: Function) {
        this.socket.on(eventName, (data: any) => fn(data));
    }
}