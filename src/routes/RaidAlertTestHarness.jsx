import React, {useEffect, useState} from 'react';
import YoshiRaidAlert from './multi/YoshiRaidAlert';
import ZeldaRaidAlert from './multi/ZeldaRaidAlert';
import ChargeRaidAlert from './multi/ChargeRaidAlert';

import {configs} from '../util/testData';
import axios from 'axios';

const getRaidAlert = async (id) => {
    let found = await axios.get(`https://deusprogrammer.com/api/streamcrabs/dynamic-alerts/${id}`, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return found.data;
}

const RaidAlertTestHarness = () => {
    const [clicked, setClicked] = useState(false);
    const [raider, setRaider] = useState("daddyfartbux");
    const [raidSize, setRaidSize] = useState(100);
    const [theme, setTheme] = useState("CUSTOM");
    const [key, setKey] = useState("SKULLMAN");
    const [storedConfig, setStoredConfig] = useState({});

    useEffect(async () => {
        // Get url params
        const urlParams = new URLSearchParams(window.location.search);
        const raidTheme = urlParams.get('theme');
        const raidId = urlParams.get('key');
        setRaider(urlParams.get('raider') ? urlParams.get('raider') : "daddyfartbux");
        setRaidSize(urlParams.get('raidSize') ? urlParams.get('raidSize') : 10);
        setTheme(urlParams.get('theme') ? urlParams.get('theme') : "YOSHI");
        setKey(urlParams.get('key') ? urlParams.get('key') : "SKULLMAN");

        if (raidTheme === "STORED") {
            let config = await getRaidAlert(raidId);
            setStoredConfig(config);
        }
    }, []);

    let raidAlert = null;

    switch(theme) {
        case "YOSHI":
            raidAlert = <YoshiRaidAlert 
                            variable={raidSize} 
                            onComplete={() => {setClicked(false)}} />;
            break;
        case "ZELDA":
            raidAlert = <ZeldaRaidAlert 
                            variable={raidSize} 
                            onComplete={() => {setClicked(false)}} />;
            break;
        case "CUSTOM":
            raidAlert = <ChargeRaidAlert 
                            variable={raidSize} 
                            config={configs[key]}
                            onComplete={() => {setClicked(false)}} />;
        case "STORED":
            raidAlert = <ChargeRaidAlert 
                            variable={raidSize} 
                            config={storedConfig}
                            onComplete={() => {setClicked(false)}} />;
            break;
    }

    return (
        <div>
            {clicked ? 
                <div>
                    {raidAlert}
                    <span className="alert-text">{`${raider} is raiding with ${raidSize} viewers.`}</span>
                </div>
             : 
                <div>
                    <p>Testing with size <b>{raidSize}</b> and raider <b>{raider}</b></p>
                    <button onClick={() => {
                        setClicked(true);
                    }}>Click to Test</button>
                    <h3>Debug</h3>
                    <pre>
                        {JSON.stringify(storedConfig, null, 5)}
                    </pre>
                </div>
            }
        </div>
    );
}

export default RaidAlertTestHarness