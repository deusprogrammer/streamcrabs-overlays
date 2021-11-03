import React, {useEffect, useState} from 'react';
import YoshiRaidAlert from './multi/YoshiRaidAlert';
import ZeldaRaidAlert from './multi/ZeldaRaidAlert';
import ChargeRaidAlert from './multi/ChargeRaidAlert';

import {configs} from '../util/testData';

const RaidAlertTestHarness = () => {
    const [clicked, setClicked] = useState(false);
    const [raider, setRaider] = useState("daddyfartbux");
    const [raidSize, setRaidSize] = useState(100);
    const [theme, setTheme] = useState("CUSTOM");
    const [key, setKey] = useState("SKULLMAN");

    useEffect(() => {
        // Get url params
        const urlParams = new URLSearchParams(window.location.search);
        setRaider(urlParams.get('raider') ? urlParams.get('raider') : "daddyfartbux");
        setRaidSize(urlParams.get('raidSize') ? urlParams.get('raidSize') : 10);
        setTheme(urlParams.get('theme') ? urlParams.get('theme') : "YOSHI");
        setKey(urlParams.get('key') ? urlParams.get('key') : "SKULLMAN");
    }, []);

    let raidAlert = null;

    switch(theme) {
        case "YOSHI":
            raidAlert = <YoshiRaidAlert 
                            raider={raider} 
                            raidSize={raidSize} 
                            onComplete={() => {setClicked(false)}} />;
            break;
        case "ZELDA":
            raidAlert = <ZeldaRaidAlert 
                            raider={raider} 
                            raidSize={raidSize} 
                            onComplete={() => {setClicked(false)}} />;
            break;
        case "CUSTOM":
            raidAlert = <ChargeRaidAlert 
                            raider={raider} 
                            raidSize={raidSize} 
                            config={configs[key]}
                            onComplete={() => {setClicked(false)}} />;
            break;
    }

    return (
        <div>
            <div id="phaser" />
            {clicked ? 
                raidAlert
             : 
                <div>
                    <p>Testing with size <b>{raidSize}</b> and raider <b>{raider}</b></p>
                    <button onClick={() => {
                        setClicked(true);
                    }}>Click to Test</button>
                </div>
            }
        </div>
    );
}

export default RaidAlertTestHarness