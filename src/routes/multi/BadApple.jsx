import React from 'react';

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

        this.timeOut = null;

        this.state = {
            averageColor: {r: 0, g: 0, b: 0},
            vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        }
    }

    componentDidMount() {
        this.videoElement.current.addEventListener("ended", () => {
            if (this.timeOut) {
                clearTimeout(this.timeOut);
            }
            this.props.onComplete("badapple");
        })

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

        this.videoElement.current.play();
    }

    timerCallback = () => {
        if ((this.videoElement && this.videoElement.current) && (this.videoElement.current.paused || this.videoElement.current.ended)) {
            return;
        }
        this.computeFrame();
        this.timeOut = setTimeout(() => {
            this.timerCallback();
        }, 0);
    };

    computeFrame = () => {
        if (!this.videoElement.current) {
            return;
        }
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