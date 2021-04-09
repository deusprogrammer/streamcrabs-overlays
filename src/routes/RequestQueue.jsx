import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

class RequestQueue extends React.Component {
	state = {
        mode: "NEXT_UP",
        requestList: []
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
            
			if (event.type === "REQUEST") {
				this.setState({requestList: event.eventData.requestList});
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

        // Cycle between next up view and queue view
        setInterval(() => {
            this.setState({mode: "QUEUE"});
            setTimeout(() => {
                this.setState({mode: "NEXT_UP"})
            }, 1000 * 10);
        }, 1000 * 60);
	}

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none", position: "relative"}} className="App">
				{this.state.mode === "NEXT_UP" ?
                    <div style={{width: "100vw", position: "absolute", bottom: "0px", left: "0px", textAlign: "center"}}>
                        {this.state.requestList.length > 0 ? <marquee>Next up: {this.state.requestList[this.state.requestList.length - 1].request} from {this.state.requestList[0].requester}</marquee>
                        :
                        <marquee>No requests so far.  Make a request by donating!</marquee>}
                    </div> 
                    :
                    <div style={{width: "100vw", position: "absolute", bottom: "0px", left: "0px", textAlign: "center"}}>
                        <h3>Coming up:</h3>
                        <table>
                            {this.state.requestList.reverse().map((request, index) => {
                                return (
                                    <div key={`entry-${index}`} style={{color: index === 0 ? "red" : "black"}}>
                                        {index + 1}: {request.request} from {request.requester}
                                    </div>
                                )
                            })}
                        </table>
                    </div> 
                }
			</div>
		);
	}
}

export default RequestQueue;
