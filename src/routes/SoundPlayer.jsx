import React from 'react';
import {createWebSocket} from '../ws/WebSocketFactory';

class SoundPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.ws = null;
        this.consumerLocked = false;
        this.state = {
            soundPlaying: false,
            requester: null,
            mediaName: null
        }
    }

    consumer = async () => {
        if (!this.ws.hasNext() || this.consumerLocked) {
            return;
        }

        let currentEvent = this.ws.next();
        let {url, volume} = currentEvent.eventData;
        this.consumerLocked = true;

        let audio = new Audio(url);
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
        let urlParams = new URLSearchParams(window.location.search);
        this.ws = createWebSocket('SOUND_PLAYER', ['AUDIO'], urlParams.get('channelId'), () => {this.setState({connected: true})});
        this.ws.connect();
        setInterval(this.consumer, 5000);
    }

    componentWillUnmount() {
		this.ws.disconnect();
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
