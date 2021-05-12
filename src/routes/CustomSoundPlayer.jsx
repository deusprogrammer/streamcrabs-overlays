import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);
const randomSoundCount = 24;

class CustomSoundPlayer extends React.Component {
    constructor() {
        super();
        this.consumerLocked = false;
        this.soundQueue = [];

        this.state = {
            soundPlaying: false,
            requester: null
        }
    }

	connect = async () => {
        const ws = new W3CWebSocket('wss://deusprogrammer.com/api/ws/twitch');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
                channelId: urlParams.get("channelId")
            }));

            setInterval(() => {
                ws.send(JSON.stringify({
                    type: "PING_SERVER",
                    from: "PANEL",
                    channelId: urlParams.get("channelId")
                }));
            }, 20 * 1000);
        };

        ws.onmessage = async (message) => {
            let event = JSON.parse(message.data);
            
			if (event.type === "CUSTOM_RANDOM_SOUND") {
                this.soundQueue.push({requester: event.eventData.requester, url: event.eventData.url})
			}
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
        if (this.soundQueue.length <= 0 || this.consumerLocked) {
            return;
        }

        let {requester, url} = this.soundQueue[0];
        this.consumerLocked = true;
        this.soundQueue = this.soundQueue.slice(1);
        this.setState({requester});

        var audio = new Audio(url);
        this.setState({soundPlaying: true});
        audio.addEventListener("ended", () => {
            this.setState({soundPlaying: false});
            setTimeout(() => {
                this.consumerLocked = false;
            }, 5000);
        });
        await audio.play();
    }

	componentDidMount() {
		// If a channel id is supplied, connect the websocket for updates via bot commands
		if (urlParams.get("channelId")) {
			this.connect();
		}

        setInterval(this.consumer, 0);
	}

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none"}} className="App">
                {this.state.soundPlaying ?
                    <div> 
                        <img 
                            style={{
                                position: "absolute",
                                width: "100px",
                                height: "100px",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }} 
                            src={`${process.env.PUBLIC_URL}/images/speaker.png`} />
                        <span style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "20pt",
                            WebkitTextStroke: "1px black",
                            WebkitTextFillColor: "white",
                        }}>{this.state.requester}</span>
                    </div>
                : null  }
            </div>
		);
	}
}

export default CustomSoundPlayer;
