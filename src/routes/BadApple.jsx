import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

const RED_THRESH   = 177;
const GREEN_THRESH = 177;
const BLUE_THRESH  = 177;

export default class BadApple extends React.Component {
    constructor(props) {
        super(props);
        this.videoElement = React.createRef();
        this.canvasElement1 = React.createRef();
        this.canvasElement2 = React.createRef();
        this.ctx1 = null;
        this.ctx2 = null;

        this.state = {
            averageColor: {r: 0, g: 0, b: 0},
            vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
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
            
			if (event.type === "BADAPPLE") {
				this.videoElement.current.play();
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

        this.ctx1 = this.canvasElement1.current.getContext('2d');
        this.ctx2 = this.canvasElement2.current.getContext('2d');
    
        this.videoElement.current.addEventListener('play', () => {
            this.timerCallback();
        }, false);

        window.onresize = () => {
            this.setState({
                vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
                vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            })
        };
    }

    timerCallback = () => {
        if (this.videoElement.paused || this.videoElement.ended) {
            return;
        }
        this.computeFrame();
        setTimeout(() => {
            this.timerCallback();
        }, 0);
    };

    computeFrame = () => {
        this.ctx1.drawImage(this.videoElement.current, 0, 0, this.state.vw, this.state.vh);
        const frame = this.ctx1.getImageData(0, 0, this.state.vw, this.state.vh);
        const length = frame.data.length;

        for (let i = 0; i < length; i += 4) {
            const red = frame.data[i + 0];
            const green = frame.data[i + 1];
            const blue = frame.data[i + 2];

            if (green <= GREEN_THRESH && red <= RED_THRESH && blue <= BLUE_THRESH) {
                frame.data[i + 3] = 0;
            }
        }
        this.ctx2.putImageData(frame, 0, 0);
    };
    
    render() {
        return (
            <div 
                style={{overflow: 'hidden'}}>
                <video
                    style={{display: "none"}}
                    src={`${process.env.PUBLIC_URL}/videos/badapple.mp4`} 
                    controls={false}
                    crossOrigin="anonymous"
                    ref={this.videoElement} />
                <canvas height={this.state.vh} width={this.state.vw} style={{display: "none"}} ref={this.canvasElement1} />
                <canvas height={this.state.vh} width={this.state.vw} style={{border: "1px solid black"}} ref={this.canvasElement2} />
            </div>
        )
    }
}