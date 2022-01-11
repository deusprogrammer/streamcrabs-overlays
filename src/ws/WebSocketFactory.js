import LocalWebSocket from './LocalWebSocket';
import RemoteWebSocket from './RemoteWebSocket';

export let createWebSocket = (panelName, listenFor, channelId, label, onConnected) => {
    console.log("BUILD TARGET: " + process.env.REACT_APP_BUILD_TARGET);
    if (process.env.REACT_APP_BUILD_TARGET === "electron") {
        return new LocalWebSocket('ws://localhost:8081', panelName, listenFor, null, label);
        onConnected();
    } else {
        return new RemoteWebSocket('wss://deusprogrammer.com/api/ws/twitch', panelName, listenFor, channelId, label, onConnected);
    }
}