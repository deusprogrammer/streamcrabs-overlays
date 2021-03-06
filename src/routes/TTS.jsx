import React from 'react';
import {createWebSocket} from '../ws/WebSocketFactory';

class TTS extends React.Component {
    constructor(props) {
        super(props);
        this.consumerLocked = false;
        this.state = {
            soundPlaying: false,
            requester: null,
            mediaName: null,
            started: false,
            textList: []
        }
    }

    consumer = () => {
        if (!this.ws.hasNext() || this.consumerLocked) {
            return;
        }

        let currentEvent = this.ws.next();
        let {requester, text} = currentEvent.eventData;
        this.consumerLocked = true;

        let msg = new SpeechSynthesisUtterance();
        msg.text = `${requester} said: '${text}'`;
        msg.voice = window.maleVoice;
        let textList = [...this.state.textList];
        textList.push("- " + msg.text);
        window.speechSynthesis.speak(msg);

        this.setState({textList});
        msg.onend = () => {
            setTimeout(() => {
                this.consumerLocked = false;
            }, 5000);
        };
    }

    componentWillUnmount() {
		this.ws.disconnect();
	}

    start = () => {
        let urlParams = new URLSearchParams(window.location.search);
        this.ws = createWebSocket('TTS', ['TTS'], urlParams.get('channelId'))
        this.ws.connect();
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
