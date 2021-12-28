import LocalWebSocket from './LocalWebSocket';
import RemoteWebSocket from './RemoteWebSocket';

export let createWebSocket = (panelName, listenFor, channelId) => {
    console.log("BUILD TARGET: " + process.env.REACT_APP_BUILD_TARGET);
    if (process.env.REACT_APP_BUILD_TARGET === "electron") {
        return new LocalWebSocket('ws://localhost:8081', panelName, listenFor);
    } else {
        return new RemoteWebSocket('wss://deusprogrammer.com/api/ws/twitch', panelName, listenFor, channelId);
    }
}