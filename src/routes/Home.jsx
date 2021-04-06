import React from 'react';
import {Link} from 'react-router-dom';

export default () => {
    return (
        <div style={{textAlign: "center", margin: "auto", width: "80%"}}>
            <h1>Twitch Tools</h1>
            <div>
                <Link to={`${process.env.PUBLIC_URL}/death-counter`}>Death Counter</Link>
            </div>
        </div>
    )
}