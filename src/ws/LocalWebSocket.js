import AbstractWebSocket from './AbstractWebSocket';
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default class LocalWebSocket extends AbstractWebSocket {
    constructor(wsAddress, panelName, listenFor, channelId, label) {
        super(wsAddress, panelName, listenFor, channelId, label);
    }

    connect = () => {
        this.ws = new W3CWebSocket(this.wsAddress);
        this.ws.onopen = () => {
            this.label.forEach((l) => {
                this.ws.send(JSON.stringify({
                    type: "PANEL_INIT",
                    from: "PANEL",
                    name: this.panelName,
                    subPanel: l
                }));

                if (this.interval[l]) {
                    clearInterval(this.interval);
                }

                this.interval[l] = setInterval(() => {
                    this.ws.send(JSON.stringify({
                        type: "PANEL_PING",
                        from: "PANEL",
                        name: this.panelName,
                        subPanel: l
                    }));
                }, 20 * 1000);
            });
        };
    
        this.ws.onmessage = (message) => {
            let event = JSON.parse(message.data);

            let subPanel = event.eventData && event.eventData.subPanel ? event.eventData.subPanel : "default";
    
            if (!this.listenFor.includes(event.type) || !this.label.includes(subPanel)) {
                return;
            }
    
            console.log("Received: " + JSON.stringify(event, null, 5));
    
            this.queue.push(event);
        };
    
        this.ws.onclose = (e) => {
            console.log('Socket is closed. Reconnect will be attempted in 5 second.', e.reason);
            clearInterval(this.interval);
            setTimeout(() => {
                this.connect();
            }, 5000);
        };
    
        this.ws.onerror = (err) => {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            this.ws.close();
        };
    }
}