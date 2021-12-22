import React, {useState} from 'react';
import VideoPlayer from './multi/VideoPlayer';

const VideoTestHarness = () => {
    const [chromaKey, setChromaKey] = useState(null);
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(255);
    const [visible, setVisible] = useState(true);
    let params = new URLSearchParams(window.location.search);
    let videoUrl = params.get("videoUrl");
    let background = params.get("backgroundUrl");

    return (
        <div style={{background: `url(${background})`}}>
            { visible ?
                <VideoPlayer
                    url={videoUrl}
                    volume={1.0}
                    chromaKey={chromaKey}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                    onComplete={() => {
                        setVisible(false);
                        setTimeout(() => {
                            setVisible(true);
                        }, 500);
                    }}
                /> : null}
            <div style={{position: "absolute", bottom: "0px", width: "100vw", textAlign: "center", zIndex: "9999"}}>
                <label>Chroma Key&nbsp;</label>
                <select onChange={({target: {value}}) => {setChromaKey(value)}}>
                    <option>None</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="black">Black</option>
                    <option value="custom">Custom</option>
                </select><br/>
                { chromaKey === "custom" ?
                    <>
                        <label>Lower Bound</label><input type="range" value={lowerBound} max={255} onChange={({target: {value}}) => {setLowerBound(value)}} /><span>{lowerBound}</span><br/>
                        <label>Upper Bound</label><input type="range" value={upperBound} max={255} onChange={({target: {value}}) => {setUpperBound(value)}} /><span>{upperBound}</span>
                    </> : null
                }
            </div>
        </div>
    );
}

export default VideoTestHarness