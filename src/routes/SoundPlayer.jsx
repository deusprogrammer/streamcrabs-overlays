import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

class SoundPlayer extends React.Component {
    state = {
        soundPlaying: false
    }

	connect = async () => {
        const ws = new W3CWebSocket('wss://deusprogrammer.com/api/ws/twitch');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
                channelId: urlParams.get("channelId")
            }));
        };

        ws.onmessage = async (message) => {
            let event = JSON.parse(message.data);
            
			if (event.type === "PLAY_SOUND") {
				var audio = new Audio('https://www.soundjay.com/human/fart-08.mp3');
                this.setState({soundPlaying: true});
                audio.addEventListener("ended", () => {this.setState({soundPlaying: false})});
                await audio.play();
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

	componentDidMount() {
		// If a channel id is supplied, connect the websocket for updates via bot commands
		if (urlParams.get("channelId")) {
			this.connect();
		}
		
		document.addEventListener("click", this.onDeath);
        document.addEventListener("contextmenu", this.onReset);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.onDeath);
        document.removeEventListener("contextmenu", this.onReset);
	}

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none"}} className="App">
                {this.state.soundPlaying ? 
                    <img 
                        style={{
                            position: "absolute",
                            width: "100px",
                            height: "100px",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }} 
                        src={`${process.env.PUBLIC_URL}/speaker.png`} /> 
                : null  }
            </div>
		);
	}
}

export default SoundPlayer;
