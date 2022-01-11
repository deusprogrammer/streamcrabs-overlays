import AbstractWebSocket from './AbstractWebSocket';
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default class RemoteWebSocket extends AbstractWebSocket {
    constructor(wsAddress, panelName, listenFor, channelId, label) {
        super(wsAddress, panelName, listenFor, channelId, label);
    }

    connect = () => {
        if (!this.channelId) {
            return;
        }

        this.ws = new W3CWebSocket(this.wsAddress);
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
                name: this.panelName,
                channelId: this.channelId
            }));
    
            if (this.interval) {
                clearInterval(this.interval);
            }
    
            this.interval = setInterval(() => {
                this.ws.send(JSON.stringify({
                    type: "PING_SERVER",
                    from: "PANEL",
                    name: this.panelName,
                    channelId: this.channelId
                }));
            }, 20 * 1000);
        };
    
        this.ws.onmessage = (message) => {
            let event = JSON.parse(message.data);

            console.log("Received: " + JSON.stringify(event, null, 5));

            if (event.type === "REGISTER_PANEL_SUCCESS") {
                console.log("Connected to bot");
            }

            let subPanel = event.eventData && event.eventData.subPanel ? event.eventData.subPanel : "default";
    
            if (!this.listenFor.includes(event.type) || this.label !== subPanel) {
                return;
            }
    
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