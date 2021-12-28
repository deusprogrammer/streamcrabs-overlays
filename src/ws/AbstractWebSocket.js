import { w3cwebsocket as W3CWebSocket } from "websocket";

export default class RemoteWebSocket {
    constructor(wsAddress, panelName, listenFor, channelId) {
        this.channelId = channelId;
        this.panelName = panelName;
        this.listenFor = listenFor;
        this.interval = null;
        this.queue = [];
        this.ws = new W3CWebSocket(wsAddress);
    }

    connect = () => {}

    disconnect = () => {
        clearInterval(this.interval);
        this.ws.onmessage = () => {};
        this.ws.onclose = () => {};
        this.ws.onerror = () => {};
        this.ws.close();
    }

    next = () => {
        if (this.queue.length <= 0) {
            return null;
        }

        let event = this.queue[0];
        this.queue = this.queue.slice(1);
        return event;
    }

    hasNext = () => {
        if (this.queue.length <= 0) {
            return false;
        }

        return true;
    }
}