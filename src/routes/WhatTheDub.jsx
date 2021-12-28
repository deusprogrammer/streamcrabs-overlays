import React from 'react'

import WhatTheDubPlayer from './WhatTheDubPlayer';
import {createWebSocket} from '../ws/WebSocketFactory';

export default class WhatTheDub extends React.Component {
    constructor(props) {
        super(props);
        this.ws = null;
        this.state = {
            currentEvent: null,
            joinedMiniGame: false
        }
    }

    consumer = () => {
        if (!this.ws.hasNext() || this.state.currentEvent) {
            return;
        }

        let entry = this.ws.next();

        if (entry.eventData.substitution) {
            entry.eventData.substitution = entry.eventData.substitution.replace(/[^\x00-\x7F]/g, "");
        }

        this.setState({currentEvent: entry});
    }

    componentDidMount() {
        let urlParams = new URLSearchParams(window.location.search);
        this.ws = createWebSocket('WTD', ['DUB'], urlParams.get('channelId'))
        this.ws.connect();
        setInterval(this.consumer, 0);
    }

    componentWillUnmount() {
		this.ws.disconnect();
	}

    render(){
        if (this.state.currentEvent && this.state.joinedMiniGame){
            return (
                <div style={{backgroundColor: "black"}}>
                    <div style={{
                        position: "absolute", 
                        top: "0px", 
                        left: "0px", 
                        width: "20vw", 
                        zIndex: 9999}}>
                        <img style={{width: "20vw"}} src="images/wtd.png" />
                    </div>
                    { this.state.currentEvent.eventData.requester ?
                        <span style={{
                            position: "absolute", 
                            top: "0px", 
                            left: "50%", 
                            transform: "translateX(-50%)",
                            fontSize: "20pt",
                            WebkitTextStroke: "1px black",
                            WebkitTextFillColor: "white",
                            zIndex: "9999"}}>
                                Submitted By {this.state.currentEvent.eventData.requester}    
                        </span> : null
                    }
                    <WhatTheDubPlayer
                        url={this.state.currentEvent.eventData.videoData.videoUrl} 
                        subtitles={this.state.currentEvent.eventData.videoData.subtitles} 
                        substitution={this.state.currentEvent.eventData.substitution} 
                        onComplete={() => {this.setState({currentEvent: null})}} />
                </div>
            )
        } else {
            return (
                <div style={{background: "black", height: "100vh"}}>
                    <div style={{position: "absolute", top: "0px", left: "0px", width: "20vw", zIndex: 9999}}>
                        <img style={{width: "20vw"}} src="images/wtd.png" />
                    </div>
                    <div style={{
                        position: "absolute", 
                        width: "100vw",
                        textAlign: "center",
                        top: "50%", 
                        left: "50%", 
                        transform: "translate(-50%, -50%)",
                        fontSize: "20pt",
                        WebkitTextStroke: "1px black",
                        WebkitTextFillColor: "white"}}>
                            Submit your answer with the command "!games:wtd:answer" followed by your submission!    
                    </div>
                    {this.state.joinedMiniGame ? null : <button onClick={() => {this.setState({joinedMiniGame: true})}} style={{position: "absolute", bottom: "0px", right: "0px", width: "200px", height: "100px"}}>Click to Join Mini Games</button>}
                </div>
            )
        }

    }
}