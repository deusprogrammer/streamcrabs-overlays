import React, {useState, useEffect} from 'react';
import {createWebSocket} from '../ws/WebSocketFactory';

export default () => {
    let ws;
    const [progress, setProgress] = useState(0);
    const [max, setMax] = useState(0);
    const [label, setLabel] = useState("");
    const [isFilling, setIsFilling] = useState(false);

    let sounds = {};
    let currentProgress = 0;
    let maxValue = 0;

    const consumer = () => {
        if (!ws.hasNext() || isFilling) {
            return;
        }

        if (!ws) {
            return;
        }

        let event = ws.next();
        if (!event.eventData.init) {
            onProgressChange(event.eventData.currentValue);
        } else {
            sounds = {
                increase: new Audio(event.eventData.increaseSoundUrl),
                decrease: new Audio(event.eventData.decreaseSoundUrl),
                complete: new Audio(event.eventData.completeSoundUrl)
            }
            currentProgress = event.eventData.currentValue;
            maxValue = event.eventData.maxValue;
            setProgress(event.eventData.currentValue);
            setMax(event.eventData.maxValue);
        }
    }

    useEffect(() => {
        let urlParams = new URLSearchParams(window.location.search);
        ws = createWebSocket('GAUGE', ['GAUGE'], urlParams.get('channelId'), urlParams.get('subPanel') ? urlParams.get('subPanel') : "default", () => {});
        ws.connect();
        setLabel(urlParams.get('label'));
        setInterval(consumer, 5000);
    }, []);

    const onProgressChange = (newProgress) => {
        let deltaT = 100;
        let deltaP = (newProgress - currentProgress)/10;
        newProgress = parseInt(newProgress);
        let interval = setInterval(() => {
            setProgress((oldValue) => {
                // When the gauge is complete, play the complete music.
                if (oldValue >= maxValue) {
                    sounds.complete.play();
                }

                // When iteration is done, clear the interval.
                if (oldValue >= newProgress) {
                    oldValue = newProgress;
                    currentProgress = newProgress;
                    clearInterval(interval);
                    setIsFilling(false);
                    return oldValue;
                }

                // Loop part of the sound
                sounds.increase.currentTime = 0;
                sounds.increase.play();

                // Increment the value
                return oldValue + deltaP;
            });
        }, deltaT);
        setIsFilling(true);
    }

    if (!max) {
        return <div></div>;
    }

    return (
        <div style={{position: "relative"}}>
            <progress style={{height: "100vh", maxHeight: "100px", width: "100vw"}} value={progress} max={max}>{progress}%</progress><br/>
            <span style={{position: "absolute", top: "50%", transform: "translateY(-50%)", textAlign: "center", width: "100vw", fontSize: "30px", fontFamily: "Marker Felt, fantasy", WebkitTextStrokeWidth: "1px", WebkitTextStrokeColor: "black", color: "white"}}>{`${label} ${progress}/${max}`}</span>
        </div>
    )
}