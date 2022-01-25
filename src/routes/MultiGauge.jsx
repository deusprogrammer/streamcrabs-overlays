import React, {useState, useEffect} from 'react';
import {createWebSocket} from '../ws/WebSocketFactory';

export default () => {
    let ws;
    const [isFilling, setIsFilling] = useState(false);
    const [displayGauge, setDisplayGauge] = useState(null);
    const [isDisappearing, setIsDisappearing] = useState(false);

    const gaugeState = {};
    let gaugeIndex = 0;

    const consumer = () => {
        if (!ws || !ws.hasNext() || isFilling) {
            return;
        }

        let event = ws.next();
        if (!event.eventData.init) {
            onProgressChange(event.eventData.subPanel, event.eventData.currentValue);
        } else {
            console.log("Adding Gauge: " + event.eventData.subPanel);
            gaugeState[event.eventData.subPanel] = {
                label: event.eventData.label,
                currentProgress: event.eventData.currentValue,
                maxValue: event.eventData.maxValue,
                sounds: {
                    increase: new Audio(event.eventData.increaseSoundUrl),
                    decrease: new Audio(event.eventData.decreaseSoundUrl),
                    complete: new Audio(event.eventData.completeSoundUrl)
                }
            }
        }
    }

    const gaugeChange = () => {
        // If a gauge isn't currently filling, change the gauge that is showing currently
        if (!isFilling) {
            const gaugeKeys = Object.keys(gaugeState);
            gaugeIndex += 1;
            if (gaugeIndex >= gaugeKeys.length) {
                gaugeIndex = 0;
            }

            const key = gaugeKeys[gaugeIndex];
            const gauge = gaugeState[key];

            console.log("GAUGES:     " + gaugeKeys);
            console.log("NEXT GAUGE: " + JSON.stringify(gauge, null, 5));

            setIsDisappearing(true);
            setTimeout(() => {
                setDisplayGauge({
                    label: gauge.label,
                    progress: gauge.currentProgress,
                    max: gauge.maxValue
                });
                setIsDisappearing(false);
            }, 1000);
        }
    }

    useEffect(() => {
        let urlParams = new URLSearchParams(window.location.search);
        ws = createWebSocket('GAUGE', ['GAUGE'], urlParams.get('channelId'), urlParams.get('subPanels') ? urlParams.get('subPanels').split(",") : [], () => {});
        ws.connect();
        const consumerInt = setInterval(consumer, 500);
        const gaugeInt = setInterval(gaugeChange, 10000);

        // Clear intervals on unmount
        return () => {
            clearInterval(consumerInt);
            clearInterval(gaugeInt);
        }
    }, []);

    const onProgressChange = (key, newProgress) => {
        setIsFilling(true);
        gaugeIndex = Object.keys(gaugeState).indexOf(key);

        let gauge = gaugeState[key];
        let deltaT = 100;
        let deltaP = (newProgress - gauge.currentProgress)/20;
        newProgress = parseInt(newProgress);
        let interval = setInterval(() => {
            setDisplayGauge((oldGauge) => {
                // When the gauge is complete, play the complete music.
                if (gauge.currentProgress >= gauge.maxValue) {
                    gauge.sounds.complete.play();
                }

                // When iteration is done, clear the interval.
                if (gauge.currentProgress >= newProgress) {
                    gauge.currentProgress = newProgress;
                    clearInterval(interval);
                    setIsFilling(false);
                    return {
                        label: gauge.label,
                        progress: gauge.currentProgress,
                        max: gauge.maxValue
                    };
                }

                // Loop part of the sound
                gauge.sounds.increase.currentTime = 0;
                gauge.sounds.increase.play();
                gauge.currentProgress += deltaP;

                return {
                    label: gauge.label,
                    progress: gauge.currentProgress,
                    max: gauge.maxValue
                };
            });
        }, deltaT);
    }

    if (!displayGauge) {
        return <div></div>;
    }

    return (
        <div className={isDisappearing ? "gauge disappearing" : "gauge appearing"} style={{position: "relative"}}>
            <progress style={{height: "100vh", maxHeight: "100px", width: "100vw"}} value={displayGauge.progress} max={displayGauge.max}>{displayGauge.progress}%</progress><br/>
            <span style={{position: "absolute", top: "50%", transform: "translateY(-50%)", textAlign: "center", width: "100vw", fontSize: "30px", fontFamily: "Marker Felt, fantasy", WebkitTextStrokeWidth: "1px", WebkitTextStrokeColor: "black", color: "white"}}>{`${displayGauge.label} ${displayGauge.progress}/${displayGauge.max}`}</span>
        </div>
    )
}