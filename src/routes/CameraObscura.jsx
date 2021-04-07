import React from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

let urlParams = new URLSearchParams(window.location.search);

class CameraObscura extends React.Component {
	
    constructor() {
        super();

        this.textRef = React.createRef();
        this.imageRef1 = React.createRef();
        this.imageRef2 = React.createRef();
        this.imageRef3 = React.createRef();
        this.imageRef4 = React.createRef();
        this.imageRef5 = React.createRef();
        this.imageRef6 = React.createRef();

        this.stages = [this.textRef, this.imageRef1, this.imageRef2, this.imageRef3, this.imageRef4, this.imageRef5, this.imageRef6];

        this.state = {
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
        };

        ws.onmessage = async (message) => {
            let event = JSON.parse(message.data);
            
			if (event.type === "BIRDUP") {
				this.birdup();
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
		
		document.addEventListener("click", this.birdup);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.birdup);
	}

	birdup = async () => {
        this.stages[0].current.style.display = "block";
        let audio = new Audio(`${process.env.PUBLIC_URL}/birdup.mp3`);
        await audio.play();

        let stage = 1;
        let interval = setInterval(() => {
            if (stage >= this.stages.length) {
                setTimeout(() => {
                    clearInterval(interval);
                    for (let s of this.stages) {
                        s.current.style.display = "none";
                    }
                }, 2000);
                return;
            }

            console.log("STAGE " + stage + "/" + this.stages.length);

            this.stages[stage++].current.style.display = "block";
        }, 300);
	}

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none", position: "relative"}} className="App">
				<div  style={{position: "absolute", fontFamily: "Cooper Black", WebkitTextStroke: "5px black", WebkitTextFillColor: "#CE01E2", bottom: "0px", left: "50%", transform: "translate(-50%, -50%)", fontSize: "70pt",  zIndex: "200", display: "none"}} ref={this.textRef}>BIRD UP!</div>
                <img  alt="birdup" style={{position: "absolute", fontSize: "20px", right: "0px", bottom: "0px", height: "20%", zIndex: "101", display: "none"}} ref={this.imageRef1} src={`${process.env.PUBLIC_URL}/birdup.png`} />
                <img  alt="birdup" style={{position: "absolute", fontSize: "20px", right: "0px", bottom: "0px", height: "40%", zIndex: "102", display: "none"}} ref={this.imageRef2} src={`${process.env.PUBLIC_URL}/birdup.png`} />
                <img  alt="birdup" style={{position: "absolute", fontSize: "20px", right: "0px", bottom: "0px", height: "60%", zIndex: "103", display: "none"}} ref={this.imageRef3} src={`${process.env.PUBLIC_URL}/birdup.png`} />
                <img  alt="birdup" style={{position: "absolute", fontSize: "20px", right: "0px", bottom: "0px", height: "80%", zIndex: "104", display: "none"}} ref={this.imageRef4} src={`${process.env.PUBLIC_URL}/birdup.png`} />
                <img  alt="birdup" style={{position: "absolute", fontSize: "20px", right: "0px", bottom: "0px", height: "100%", zIndex: "105", display: "none"}} ref={this.imageRef5} src={`${process.env.PUBLIC_URL}/birdup.png`} />
                <img  alt="birdup" style={{position: "absolute", fontSize: "20px", right: "0px", bottom: "0px", height: "120%", zIndex: "106", display: "none"}} ref={this.imageRef6} src={`${process.env.PUBLIC_URL}/birdup.png`} />
			</div>
		);
	}
}

export default CameraObscura;
