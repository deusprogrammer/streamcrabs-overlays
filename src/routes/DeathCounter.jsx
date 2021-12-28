import React from 'react';
import RemoteWebSocket from '../ws/RemoteWebSocket';

const fontSize = 32;

class DeathCounter extends React.Component {
	constructor(props) {
        super(props);
        this.ws = null;
        this.interval = null;
        this.state = {
            currentEvent: null,
			deaths: 0,
			textScale: 1
        }
    }

    consumer = () => {
        if (!this.ws.hasNext()) {
            return;
        }

        let currentEvent = this.ws.next();
        this.onDeath(currentEvent.eventData.count);
    }

	componentDidMount() {
		let urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get("channelId")) {
			this.ws = new RemoteWebSocket('wss://deusprogrammer.com/api/ws/twitch', 'DEATH_COUNTER', ['DEATH_COUNT'], urlParams.get('channelId'))
			this.ws.connect();
		}
		
        document.addEventListener("contextmenu", (e) => {this.onReset(e)});
        setInterval(this.consumer, 0);
	}

	componentWillUnmount() {
        document.removeEventListener("contextmenu", (e) => {this.onReset(e)});
		this.ws.disconnect();
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
