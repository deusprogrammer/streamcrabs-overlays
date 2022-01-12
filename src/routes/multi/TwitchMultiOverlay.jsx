import React from 'react';

import BirdUp from './BirdUp';
import ZeldaRaidAlert from './ZeldaRaidAlert';
import ChargeRaidAlert from './ChargeRaidAlert';
import VideoPlayer from './VideoPlayer';

import {createWebSocket} from '../../ws/WebSocketFactory';
import GifPlayer from './GifPlayer';

export default class TwitchMultiOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.ws = null;
        this.interval = null;
        this.state = {
            currentEvent: null,
            connected: false
        }
    }

    consumer = () => {
        if (!this.ws.hasNext() || this.state.currentEvent) {
            console.log(`SKIPPING: ${this.ws.hasNext()} || ${this.state.currentEvent}`);
            return;
        }

        console.log("EVENT");

        let currentEvent = this.ws.next();
        this.setState({currentEvent});
    }

    reset = () => {
        this.setState({currentEvent: null});
    }

    componentDidMount() {
        let urlParams = new URLSearchParams(window.location.search);
        this.ws = createWebSocket('MULTI', ['BIRDUP', 'BADAPPLE', 'VIDEO', 'IMAGE', 'DYNAMIC'], urlParams.get('channelId'), urlParams.get('subPanel') ? urlParams.get('subPanel') : "default", () => {this.setState({connected: true})});
        this.ws.connect();
        setInterval(this.consumer, 5000);
    }

    componentWillUnmount() {
		this.ws.disconnect();
	}

    render() {
        let showComponent = null;

        if (!this.state.currentEvent) {
            return (<div></div>)
        }

        switch(this.state.currentEvent.type) {
            case "BIRDUP":
                showComponent = <BirdUp 
                                    onComplete={this.reset}
                                    requester={this.state.currentEvent.eventData.requester} />;
                break;
            case "VIDEO":
                showComponent = <VideoPlayer 
                                    onComplete={this.reset} 
                                    url={this.state.currentEvent.eventData.url}
                                    volume={this.state.currentEvent.eventData.volume}
                                    soundUrl={this.state.currentEvent.eventData.soundUrl}
                                    soundVolume={this.state.currentEvent.eventData.soundVolume}
                                    chromaKey={this.state.currentEvent.eventData.chromaKey} />;
                break;
            case "IMAGE":
                showComponent = <GifPlayer
                                    onComplete={this.reset}
                                    url={this.state.currentEvent.eventData.url}
                                    soundUrl={this.state.currentEvent.eventData.soundUrl}
                                    volume={this.state.currentEvent.eventData.soundVolume} />
                break;
            case "DYNAMIC":
                if (this.state.currentEvent.eventData.theme === "ZELDA2") {
                    showComponent = <ZeldaRaidAlert 
                                        onComplete={this.reset}
                                        variable={this.state.currentEvent.eventData.variable} />;
                } else if (this.state.currentEvent.eventData.theme === "STORED") {
                    showComponent = <ChargeRaidAlert 
                                        onComplete={this.reset}
                                        variable={this.state.currentEvent.eventData.variable}
                                        config={this.state.currentEvent.eventData.customTheme} />;
                }
                break;
        }

        return (
            <div>
                <div className="multiContainer">
                    {showComponent}
                    <span className="alert-text">{this.state.currentEvent.eventData.message}</span>
                </div>
            </div>
        )
    }
}