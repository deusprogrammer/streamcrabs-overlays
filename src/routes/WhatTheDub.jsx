import React from 'react'
import { w3cwebsocket as W3CWebSocket } from "websocket";

import WhatTheDubPlayer from './WhatTheDubPlayer';

let urlParams = new URLSearchParams(window.location.search);

export default class WhatTheDub extends React.Component{
    constructor(props){
        super(props)

        this.queue = []
        this.state={
            finishedLoading:false,
            theme:'light',
            isVisible:true,
            currentEvent: null,
            joinedMiniGame: false
        }
    }

    connect(channelId) {
        console.log("CONNECT CALLED");
        const ws = new W3CWebSocket('wss://deusprogrammer.com/api/ws/twitch');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
                name: "WTD",
                channelId
            }));

            setInterval(() => {
                ws.send(JSON.stringify({
                    type: "PING_SERVER",
                    from: "PANEL",
                    name: "WTD",
                    channelId
                }));
            }, 20 * 1000);
        };

        ws.onmessage = (message) => {
            let event = JSON.parse(message.data);

            console.log("EVENT: " + JSON.stringify(event), null, 5);

            if (event.type === "DUB") {
                this.queue.push({event});
            }
        };

        ws.onclose = (e) => {
            console.log('Socket is closed. Reconnect will be attempted in 5 second.', e.reason);
            this.setState({ mobs: [] });
            setTimeout(() => {
                this.connect();
            }, 5000);
        };

        ws.onerror = (err) => {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            ws.close();
        };
    }

    componentDidMount(){
        // If a channel id is supplied, connect the websocket for updates via bot commands
		if (urlParams.get("channelId")) {
			this.connect(urlParams.get("channelId"));
		}

        setInterval(() => {
            if (this.queue.length <= 0 || this.state.currentEvent) {
                return;
            }
    
            let entry = this.queue[0];
            this.queue = this.queue.slice(1);

            if (entry.event.eventData.substitution) {
                entry.event.eventData.substitution = entry.event.eventData.substitution.replace(/[^\x00-\x7F]/g, "");
            }
    
            this.setState({currentEvent: entry.event});
        }, 1000);
    }
    
    render(){
        if (this.state.currentEvent && this.state.joinedMiniGame){
            return (
                <div style={{backgroundColor: "black"}}>
                    <div style={{position: "absolute", top: "0px", left: "0px", width: "100px", zIndex: 9999}}>
                        <img style={{width: "200px"}} src="images/wtd.png" />
                    </div>
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
                    <div style={{position: "absolute", top: "0px", left: "0px", width: "100px", zIndex: 9999}}>
                        <img style={{width: "200px"}} src="images/wtd.png" />
                    </div>
                    {this.state.joinedMiniGame ? null : <button onClick={() => {this.setState({joinedMiniGame: true})}} style={{position: "absolute", bottom: "0px", right: "0px", width: "200px", height: "100px"}}>Click to Join Mini Games</button>}
                </div>
            )
        }

    }
}