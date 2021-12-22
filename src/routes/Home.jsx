import React, {useState} from 'react';
import {Link} from 'react-router-dom';

export default () => {
    const [color, setColor] = useState(0);
    return (
        <div style={{textAlign: "center", margin: "auto", width: "100vw", height: "100vh", backgroundColor: `rgb(${color}, ${color}, ${color})`, color: `rgb(${255 - color}, ${255 - color}, ${255 - color})`}}>
            <h1>Twitch Tools</h1>
            <div>
                <Link to={`${process.env.PUBLIC_URL}/death-counter`}>Death Counter</Link><br/>
                <Link to={`${process.env.PUBLIC_URL}/sound-player`}>Sound Player</Link><br/>
                <Link to={`${process.env.PUBLIC_URL}/birdup`}>BIRD UP</Link><br/>
                <input type="range" value={color} max={255} onChange={({target: {value}}) => {setColor(value)}} /><span>{color}</span>
            </div>
        </div>
    )
}