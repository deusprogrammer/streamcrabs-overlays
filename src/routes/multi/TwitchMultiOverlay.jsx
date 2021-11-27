import React from 'react';
import BadApple from './BadApple';
import BirdUp from './BirdUp';
import ZeldaRaidAlert from './ZeldaRaidAlert';
import YoshiRaidAlert from './YoshiRaidAlert';
import ChargeRaidAlert from './ChargeRaidAlert';
import RandomCustomVideo from './RandomCustomVideo';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

export default class TwitchMultiOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.queue = [];
        this.interval = null;

        this.state = {
            currentEvent: null
        }
    }

    connect = async () => {
        const ws = new W3CWebSocket('wss://deusprogrammer.com/api/ws/twitch');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
                name: "MULTI",
                channelId: urlParams.get("channelId")
            }));

            if (this.interval) {
                clearInterval(this.interval);
            }

            this.interval = setInterval(() => {
                ws.send(JSON.stringify({
                    type: "PING_SERVER",
                    from: "PANEL",
                    name: "MULTI",
                    channelId: urlParams.get("channelId")
                }));
            }, 20 * 1000);
        };

        ws.onmessage = async (message) => {
            let event = JSON.parse(message.data);

            if (!["BIRDUP", "BADAPPLE", "VIDEO", "DYNAMIC"].includes(event.type)) {
                return;
            }

            console.log("Received: " + JSON.stringify(event, null, 5));

            this.queue.push(event);
        };

        ws.onclose = async (e) => {
            console.log('Socket is closed. Reconnect will be attempted in 5 second.', e.reason);
            this.setState({ mobs: [] });
            setTimeout(async () => {
                this.connect();
            }, 5000);
        };

        ws.onerror = async (err) => {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            ws.close();
        };
    }

    consumer = async () => {
        if (this.queue.length <= 0 || this.state.currentEvent) {
            return;
        }

        console.log("EVENT");

        let currentEvent = this.queue[0];
        this.queue = this.queue.slice(1);
        this.playing = true;

        this.setState({currentEvent});
    }

    componentDidMount() {
        // If a channel id is supplied, connect the websocket for updates via bot commands
		if (urlParams.get("channelId")) {
			this.connect();
		}

        setInterval(this.consumer, 1000);
    }

    reset = () => {
        this.setState({currentEvent: null});
    }

    render() {
        let showComponent = null;

        console.log(JSON.stringify(this.state.currentEvent, null, 5));

        if (!this.state.currentEvent) {
            return (<div></div>)
        }

        switch(this.state.currentEvent.type) {
            case "BADAPPLE":
                showComponent = <BadApple 
                                    onComplete={this.reset}
                                    requester={this.state.currentEvent.eventData.requester} />;
                break;
            case "BIRDUP":
                showComponent = <BirdUp 
                                    onComplete={this.reset}
                                    requester={this.state.currentEvent.eventData.requester} />;
                break;
            case "VIDEO":
                showComponent = <RandomCustomVideo 
                                    onComplete={this.reset} 
                                    url={this.state.currentEvent.eventData.url}
                                    message={this.state.currentEvent.eventData.message}
                                    volume={this.state.currentEvent.eventData.volume}
                                    chromaKey={this.state.currentEvent.eventData.chromaKey} />;
                break;
            case "DYNAMIC":
                if (this.state.currentEvent.eventData.raidTheme === "YOSHI") {
                    showComponent = <YoshiRaidAlert 
                                        onComplete={this.reset}
                                        message={this.state.currentEvent.eventData.message}
                                        variable={this.state.currentEvent.eventData.variable} />;
                } else if (this.state.currentEvent.eventData.raidTheme === "ZELDA2") {
                    showComponent = <ZeldaRaidAlert 
                                        onComplete={this.reset}
                                        message={this.state.currentEvent.eventData.message}
                                        variable={this.state.currentEvent.eventData.variable} />;
                } else if (this.state.currentEvent.eventData.raidTheme === "STORED") {
                    showComponent = <ChargeRaidAlert 
                                        onComplete={this.reset}
                                        message={this.state.currentEvent.eventData.message}
                                        variable={this.state.currentEvent.eventData.variable}
                                        config={this.state.currentEvent.eventData.raidCustomTheme} />;
                }
                break;
        }

        return (
            <div>
                <div className="multContainer">
                    {showComponent}
                </div>
            </div>
        )
    }
}