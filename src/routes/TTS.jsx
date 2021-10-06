import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

class TTS extends React.Component {
    constructor() {
        super();
        this.consumerLocked = false;
        this.soundQueue = [];

        this.state = {
            soundPlaying: false,
            requester: null,
            mediaName: null,
            started: false,
            textList: []
        }
    }

	connect = async () => {
        const ws = new W3CWebSocket('wss://deusprogrammer.com/api/ws/twitch');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
                name: "TTS",
                channelId: urlParams.get("channelId")
            }));

            setInterval(() => {
                ws.send(JSON.stringify({
                    type: "PING_SERVER",
                    from: "PANEL",
                    name: "TTS",
                    channelId: urlParams.get("channelId")
                }));
            }, 20 * 1000);
        };

        ws.onmessage = async (message) => {
            let event = JSON.parse(message.data);
            
			if (event.type === "TTS") {
                this.soundQueue.push({requester: event.eventData.requester, text: event.eventData.text})
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

        let {requester, text} = this.soundQueue[0];
        this.consumerLocked = true;
        this.soundQueue = this.soundQueue.slice(1);

        let msg = new SpeechSynthesisUtterance();
        msg.text = `${requester} said: '${text}'`;
        msg.voice = window.maleVoice;
        let textList = [...this.state.textList];
        textList.push("- " + msg.text);
        window.speechSynthesis.speak(msg);

        this.setState({soundPlaying: true, textList});
        msg.onend = () => {
            this.setState({soundPlaying: false});
            setTimeout(() => {
                this.consumerLocked = false;
            }, 5000);
        };
    }

	componentDidMount() {
	}

    start = () => {
        // If a channel id is supplied, connect the websocket for updates via bot commands
		if (urlParams.get("channelId")) {
			this.connect();
		}

        setInterval(this.consumer, 0);
        this.setState({started: true, textList: ["** Connected to Websocket **"]});
    }

	render() {
		return (
			<div>
                <h1>TTS Tool (Open in Browser, not in Streaming Tool)</h1>
                {this.state.started ? <button disabled>TTS Activated</button> : <button onClick={() => {this.start();}}>Activate TTS</button>}
                <h3>Log</h3>
                <pre style={{backgroundColor: "gray", color: "white", width: "80%", height: "500px", marginLeft: "10px"}}>
                    {this.state.textList.map((text) => {
                        return " " + text + "\n";
                    })}
                </pre>
            </div>
		);
	}
}

export default TTS;
