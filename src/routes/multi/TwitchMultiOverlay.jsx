import React from 'react';

import BirdUp from './BirdUp';
import ZeldaRaidAlert from './ZeldaRaidAlert';
import ChargeRaidAlert from './ChargeRaidAlert';
import VideoPlayer from './VideoPlayer';

import RemoteWebSocket from '../../ws/RemoteWebSocket';

export default class TwitchMultiOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.ws = null;
        this.interval = null;
        this.state = {
            currentEvent: null
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
		if (urlParams.get("channelId")) {
            this.ws = new RemoteWebSocket('wss://deusprogrammer.com/api/ws/twitch', 'MULTI', ['BIRDUP', 'BADAPPLE', 'VIDEO', 'DYNAMIC'], urlParams.get('channelId'))
			this.ws.connect();
            setInterval(this.consumer, 5000);
		}
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
                                    chromaKey={this.state.currentEvent.eventData.chromaKey} />;
                break;
            case "DYNAMIC":
                if (this.state.currentEvent.eventData.raidTheme === "ZELDA2") {
                    showComponent = <ZeldaRaidAlert 
                                        onComplete={this.reset}
                                        variable={this.state.currentEvent.eventData.variable} />;
                } else if (this.state.currentEvent.eventData.raidTheme === "STORED") {
                    showComponent = <ChargeRaidAlert 
                                        onComplete={this.reset}
                                        variable={this.state.currentEvent.eventData.variable}
                                        config={this.state.currentEvent.eventData.raidCustomTheme} />;
                }
                break;
        }

        return (
            <div>
                <div className="multContainer">
                    {showComponent}
                    <span className="alert-text">{this.state.currentEvent.eventData.message}</span>
                </div>
            </div>
        )
    }
}