import React from 'react';

export default class WhatTheDub extends React.Component {
    constructor(props) {
        super(props);
        this.videoElement = React.createRef();

        this.timeOut = null;
        this.isTalking = false;
        this.currentSub = null;

        this.state = {
            vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            currentText: ""
        }
    }

    componentDidMount() {
        this.videoElement.current.addEventListener("ended", () => {
            if (this.timeOut) {
                clearTimeout(this.timeOut);
            }
            this.props.onComplete("wtd");
        });

        window.onresize = () => {
            this.setState({
                vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
                vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            })
        };
    }

    setCurrentText = (currentText) => {
        this.setState({currentText});
    }

    updateSubtitle = (e) => {
        try {
            let index = 0;
            for (let subtitle of this.props.subtitles) {
                if (e.target.currentTime > subtitle.startTime && e.target.currentTime < subtitle.endTime) {
                    if (subtitle.text === "[male_dub]" || subtitle.text === "[female_dub]") {
                        this.videoElement.current.volume = 0.0;
                    } else {
                        this.videoElement.current.volume = 1.0;
                    }

                    if (!this.state.currentText || index !== this.currentSub) {
                        if (this.isTalking) {
                            console.log("PAUSE");
                            this.videoElement.current.pause();
                            return;
                        }

                        if (subtitle.text === "[male_dub]" || subtitle.text === "[female_dub]") {
                            this.videoElement.current.volume = 0.0;

                            if (this.props.substitution) {
                                let voice = null;

                                console.log(subtitle.text);

                                if (subtitle.text === "[male_dub]") {
                                    voice = window.maleVoice;
                                } else {
                                    voice = window.femaleVoice;
                                }

                                this.isTalking = true;
                                this.setCurrentText(this.props.substitution);
                                let msg = new SpeechSynthesisUtterance();
                                msg.voice = voice;
                                msg.text = this.props.substitution;
                                msg.onend = () => {
                                    this.isTalking = false;
                                    let ve = document.getElementById("videoElement");
                                    ve.volume = 1.0;
                                    ve.play();
                                }
                                window.speechSynthesis.speak(msg);
                            } else {
                                this.setCurrentText("<Missing audio>");
                            }
                        } else {
                            this.setCurrentText(subtitle.text);
                        }

                        this.currentSub = index;
                    }
                    return;
                }
                index++;
            }

            this.setCurrentText("");
        } catch (error) {
            console.error("Error occurred in subtitle handler: " + error);
        }
    }
    
    render() {
        return (
            <div 
                style={{overflow: 'hidden', width: "100vw", height: "100vh", position: "relative"}}>
                <div style={{position: "absolute", top: "0px", width: "100%", height: "100vh", zIndex: 9998}}>
                    <video
                        id="videoElement"
                        src={this.props.url}
                        style={{width: this.state.vw, height: this.state.vh}}
                        autoPlay={true}
                        controls={false}
                        crossOrigin="anonymous"
                        onTimeUpdate={(e) => {this.updateSubtitle(e)}}
                        ref={this.videoElement} />
                </div>
                <div style={{position: "absolute", bottom: "0px", height: "50px", width: "100%", textAlign: "center", fontSize: "30pt", WebkitTextStroke: "1px black", WebkitTextFillColor: "white", zIndex: 9999}}>
                    {this.state.currentText}
                </div>
            </div>
        )
    }
}