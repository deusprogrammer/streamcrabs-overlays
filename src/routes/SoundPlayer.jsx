import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);
const randomSoundCount = 24;

class SoundPlayer extends React.Component {
    constructor() {
        super();
        this.consumerLocked = false;
        this.soundQueue = [];
        this.interval = null;

        this.state = {
            soundPlaying: false,
            requester: null,
            mediaName: null
        }
    }

	connect = async () => {
        const ws = new W3CWebSocket('wss://deusprogrammer.com/api/ws/twitch');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
                name: "SOUND_PLAYER",
                channelId: urlParams.get("channelId")
            }));

            if (this.interval) {
                clearInterval(this.interval);
            }

            this.interval = setInterval(() => {
                ws.send(JSON.stringify({
                    type: "PING_SERVER",
                    from: "PANEL",
                    name: "SOUND_PLAYER",
                    channelId: urlParams.get("channelId")
                }));
            }, 20 * 1000);
        };

        ws.onmessage = async (message) => {
            let event = JSON.parse(message.data);

            console.log("Received: " + JSON.stringify(event, null, 5));
            
			if (event.type === "AUDIO") {
                this.soundQueue.push({requester: event.eventData.requester, mediaName: event.eventData.mediaName, url: event.eventData.url, volume: event.eventData.volume, message: event.eventData.message})
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

        let {url, volume, message} = this.soundQueue[0];
        this.consumerLocked = true;
        this.soundQueue = this.soundQueue.slice(1);
        this.setState({message});

        console.log("PLAYING: " + url);

        var audio = new Audio(url);
        this.setState({soundPlaying: true});
        audio.addEventListener("ended", () => {
            this.setState({soundPlaying: false});
            setTimeout(() => {
                this.consumerLocked = false;
            }, 5000);
        });
        audio.volume = volume;
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
                            WebkitTextFillColor: "white"
                        }}>
                            {this.state.message}
                        </span>
                    </div>
                : null  }
            </div>
		);
	}
}

export default SoundPlayer;
