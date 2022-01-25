export default class RemoteWebSocket {
    constructor(wsAddress, panelName, listenFor, channelId, label) {
        this.channelId = channelId;
        if (!Array.isArray(label)) {
            label = [label];
        }
        this.label = label;
        this.panelName = panelName;
        this.listenFor = listenFor;
        this.interval = {};
        this.queue = [];
        this.wsAddress = wsAddress;
        this.ws = null;
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