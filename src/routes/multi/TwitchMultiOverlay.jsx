import React from 'react';
import BadApple from './BadApple';
import BirdUp from './BirdUp';
import RandomCustomVideo from './RandomCustomVideo';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

export default class TwitchMultiOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.playing = false;
        this.queue = [];

        this.state = {
            show: {
                birdup: false,
                badapple: false,
                // randomvideo: false,
                randomcustomvideo: false
            }
        }
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

            console.log("EVENT: " + event.type);
            
			switch(event.type) {
                case "BADAPPLE":
                    this.queue.push("badapple");
                    break;
                // case "RANDOM_VIDEO":
                //     this.queue.push("randomvideo");
                //     break;
                case "RANDOM_CUSTOM_VIDEO":
                    this.queue.push("randomcustomvideo");
                    this.url = event.eventData.url;
                    break;
                case "BIRDUP":
                    this.queue.push("birdup");
                    break;
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

    consumer = async () => {
        if (this.queue.length <= 0 || this.playing) {
            return;
        }

        let entry = this.queue[0];
        this.queue = this.queue.slice(1);
        this.playing = true;

        this.enable(entry);
    }

    componentDidMount() {
        // If a channel id is supplied, connect the websocket for updates via bot commands
		if (urlParams.get("channelId")) {
			this.connect();
		}

        setInterval(this.consumer, 1000);

        if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
            console.log("Video API is supported");
        }
    }

    enable = (key) => {
        let show = {...this.state.show};
        show[key] = true;
        this.setState({show});
        this.playing = true;
    }

    reset = (key) => {
        let show = {...this.state.show};
        show[key] = false;
        this.setState({show});
        this.playing = false;
    }

    render() {
        let showComponent = null;
        if (this.state.show.birdup) {
            showComponent = <BirdUp onComplete={this.reset} />;
        } else if (this.state.show.badapple) {
            showComponent = <BadApple onComplete={this.reset} />;
        } else if (this.state.show.randomcustomvideo) {
            showComponent = <RandomCustomVideo onComplete={this.reset} url={this.url} />;
        }

        return (
            <div>
                <div className="multContainer">
                    {showComponent}
                </div>
            </div>
        )
    }
}