import React from 'react';
import {createWebVttDataUri} from '../util/VideoTools';

export default class WhatTheDubPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.videoElement = React.createRef();

        this.timeOut = null;
        this.currentIndex = -1;
        this.isTalking = false;
        this.hasEnded = false;

        this.state = {
            vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            muted: false
        }
    }

    componentDidMount() {
        window.onresize = () => {
            this.setState({
                vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
                vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            })
        };

        this.videoElement.current.play();

        this.zombieInterval = window.setInterval(() => {
            console.log("CHECKING FOR ZOMBIES");
            console.log("IS TALKING? " + this.isTalking);
            console.log("HAS ENDED?  " + this.hasEnded);
            if (!this.isTalking && this.hasEnded) {
                console.log("OKAY, NOW I'M DONE.");
                this.pauseListener();
                this.props.onComplete();
                return;
            }
        }, 3000);
    }

    componentWillUnmount() {
        console.log("SHIT");
        window.clearInterval(this.zombieInterval);
    }

    setIsTalking(b) {
        this.isTalking = b;
    }

    setMuted(muted) {
        this.setState({muted});
    }

    setCurrentIndex(i) {
        this.currentIndex = i;
    }

    speak(subtitle, text) {
        let voice = null;

        this.setIsTalking(true);

        if (subtitle.text === "[male_dub]") {
            voice = window.maleVoice;
        } else {
            voice = window.femaleVoice;
        }
        
        let msg = new SpeechSynthesisUtterance();
        msg.voice = voice;
        msg.text = text;
        msg.onend = () => {
            console.log("SPEAKING HAS ENDED");
            this.setIsTalking(false);
            let ve = document.getElementById("videoElement");
            ve.play();
        }
        window.speechSynthesis.speak(msg);
    }

    updateSubtitle(video) {
        let index = this.props.subtitles.findIndex((subtitle) => {
            return video.currentTime > subtitle.startTime && video.currentTime < subtitle.endTime;
        });

        if (index !== this.currentIndex) {
            if (this.isTalking) {
                video.pause();
                return;
            }

            if (this.currentIndex >= 0) {
                let currentSubtitle = this.props.subtitles[this.currentIndex];
                if (currentSubtitle.text === "[male_dub]" || currentSubtitle.text === "[female_dub]") {
                    this.setMuted(false);
                }
            }

            if (index >= 0) {
                let subtitle = this.props.subtitles[index];
                if (subtitle.text === "[male_dub]" || subtitle.text === "[female_dub]") {
                    this.setMuted(true);
                    if (this.props.substitution) {
                        this.speak(subtitle, this.props.substitution);
                    }
                }        
            }

            this.setCurrentIndex(index);
        }
    }

    startListener() {
        this.interval = setInterval(() => {
            let video = document.getElementById("videoElement");
            if (!video) {
                this.pauseListener();
                return;
            }    
            this.updateSubtitle(video);
        }, 1000/60);
    }

    pauseListener() {
        clearInterval(this.interval);
    }
    
    render() {
        return (
            <div 
                style={{overflow: 'hidden', width: "100vw", height: "100vh", position: "relative"}}>
                <div style={{position: "absolute", top: "0px", width: "100%", height: "100vh", zIndex: 9998, backgroundColor: "black"}}>
                    <video
                        id="videoElement"
                        src={this.props.url}
                        style={{width: this.state.vw, height: this.state.vh}}
                        controls={false}
                        crossOrigin="anonymous"
                        onPlay={() => {this.startListener()}}
                        onPause={() => {this.pauseListener()}}
                        onEnded={() => {
                            if (this.isTalking) {
                                console.log("DONE");
                                this.pauseListener(); 
                                this.props.onComplete();
                            } else {
                                console.log("NOT QUITE DONE");
                                this.hasEnded = true;
                            }
                        }}
                        muted={this.state.muted}
                        ref={this.videoElement}>
                            <track label="English" kind="subtitles" srclang="en" src={createWebVttDataUri(this.props.subtitles, this.props.substitution)} default></track>
                    </video>
                </div>
            </div>
        )
    }
}