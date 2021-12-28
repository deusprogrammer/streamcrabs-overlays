import React from 'react';
import RemoteWebSocket from '../ws/RemoteWebSocket';

class RequestQueue extends React.Component {
    constructor(props) {
        super(props);
        this.ws = null;
        this.interval = null;
        this.state = {
            mode: "NEXT_UP",
            requestList: []
        }
    }

    consumer = () => {
        if (!this.ws.hasNext()) {
            return;
        }

        let currentEvent = this.ws.next();
        this.setState({requestList: currentEvent.eventData.requestList});
    }

	componentDidMount() {
		let urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get("channelId")) {
            this.ws = new RemoteWebSocket('wss://deusprogrammer.com/api/ws/twitch', 'REQUESTS', ['REQUEST'], urlParams.get('channelId'))
			this.ws.connect();
            setInterval(this.consumer, 0);
        }

        // Cycle between next up view and queue view
        setInterval(() => {
            this.showQueue();
        }, 1000 * 60);
	}

    componentWillUnmount() {
        this.ws.disconnect();
    }

    showQueue = () => {
        this.setState({mode: "QUEUE"});
        setTimeout(() => {
            this.setState({mode: "NEXT_UP"})
        }, 1000 * 10);
    }

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none", position: "relative"}} className="App">
                    <div style={{width: "100vw", position: "absolute", bottom: "0px", left: "0px", textAlign: "center", fontSize: "20pt", WebkitTextStroke: "1px black", WebkitTextFillColor: "white"}} onClick={this.showQueue}>
                        {this.state.requestList.length > 0 ? <marquee>Next up: {this.state.requestList[this.state.requestList.length - 1].request} from {this.state.requestList[this.state.requestList.length - 1].requester}</marquee>
                        :
                        <marquee>No requests so far.  Make a request by donating!</marquee>}
                    </div>
                    <div style={{width: "100vw", position: "absolute", bottom: "0px", left: "0px", textAlign: "center"}}>
                        <div className={this.state.mode === "QUEUE" ? "open" : "closed"} style={{maxWidth: "50%", margin: "auto", padding: "0px 5px", backgroundColor: "gray", color: "white"}}>
                            <strong>Coming up:</strong>
                            {this.state.requestList.slice().reverse().slice(0, 3).map((request, index) => {
                                return (
                                    <div key={`entry-${index}`} style={{color: index === 0 ? "yellow" : "white"}}>
                                        {index + 1}: {request.request} from {request.requester}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
			</div>
		);
	}
}

export default RequestQueue;
