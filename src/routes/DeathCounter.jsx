import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

const fontSize = 32;

class DeathCounter extends React.Component {
	state = {
		deaths: 0,
		textScale: 1
	}

	connect = async () => {
        const ws = new W3CWebSocket('wss://deusprogrammer.com/api/ws/twitch');

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "REGISTER_PANEL",
                from: "PANEL",
				name: "DEATH_COUNTER",
                channelId: urlParams.get("channelId")
            }));

			setInterval(() => {
                ws.send(JSON.stringify({
                    type: "PING_SERVER",
                    from: "PANEL",
					name: "DEATH_COUNTER",
                    channelId: urlParams.get("channelId")
                }));
            }, 20 * 1000);
        };

        ws.onmessage = async (message) => {
            let event = JSON.parse(message.data);
            
			if (event.type === "DEATH_COUNT") {
				this.onDeath(event.eventData.count);
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
		
		document.addEventListener("click", () => {this.onDeath()});
        document.addEventListener("contextmenu", (e) => {this.onReset(e)});
	}

	componentWillUnmount() {
		document.removeEventListener("click", () => {this.onDeath()});
        document.removeEventListener("contextmenu", (e) => {this.onReset(e)});
	}

	onReset = (e) => {
		this.setState({deaths: 0, textScale: 1});
		e.preventDefault();
		return false;
	}

	onDeath = (count = null) => {
		this.setState((prevState) => {
			return {
				deaths: count !== -1 ? count : prevState.deaths + 1,
				textScale: 1
			}
		});

		let direction = 1;

		let interval = setInterval(() => {
			//If scaling up
			if (this.state.textScale <= 2 && direction > 0) {
				this.setState((prevState) => {
					return {
						textScale: Math.min(prevState.textScale + 0.1, 2)
					}
				});
			}

			// If scaling down
			if (this.state.textScale >= 1 && direction < 0) {
				this.setState((prevState) => {
					return {
						textScale: Math.max(prevState.textScale - 0.1, 1)
					}
				});
			}

			// If done animating up
			if (this.state.textScale >= 2 && direction > 0) {
				direction = -1;
			}

			// If done animating down
			if (this.state.textScale <= 1 && direction < 0) {
				clearInterval(interval);
			}
		}, 10);
	}

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none"}} className="App">
				<span style={{fontWeight: "bolder", fontSize: `${this.state.textScale * fontSize}pt`, WebkitTextStroke: "2px black", WebkitTextFillColor: "white", lineHeight: "100vh", height: "100vh"}}>Deaths: {this.state.deaths}</span>
			</div>
		);
	}
}

export default DeathCounter;
