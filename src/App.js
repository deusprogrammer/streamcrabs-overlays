import React from 'react';
import './App.css';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DeathCounter from './routes/DeathCounter';
import Home from './routes/Home';
import RequestQueue from './routes/RequestQueue';
import TwitchMultiOverlay from './routes/multi/TwitchMultiOverlay';
import SoundPlayer from './routes/SoundPlayer';
import SpeechSynthesisTester from './routes/SpeechSynthesisTester';
import WhatTheDub from './routes/WhatTheDub';
import RaidAlertTestHarness from './routes/RaidAlertTestHarness';
import TTS from './routes/TTS';
import VideoTestHarness from './routes/VideoTestHarness';
import Gauge from './routes/Gauge';
import MultiGauge from './routes/MultiGauge';

class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path={`${process.env.PUBLIC_URL}/tts`} component={TTS} exact />
					<Route path={`${process.env.PUBLIC_URL}/wtd`} component={WhatTheDub} exact />
					<Route path={`${process.env.PUBLIC_URL}/speech/test`} component={SpeechSynthesisTester} exact />
					<Route path={`${process.env.PUBLIC_URL}/multi`} component={TwitchMultiOverlay} exact />
					<Route path={`${process.env.PUBLIC_URL}/death-counter`} component={DeathCounter} exact />
					<Route path={`${process.env.PUBLIC_URL}/sound-player`} component={SoundPlayer} exact />
					<Route path={`${process.env.PUBLIC_URL}/requests`} component={RequestQueue} exact />
					<Route path={`${process.env.PUBLIC_URL}/raid-test`} component={RaidAlertTestHarness} exact />
					<Route path={`${process.env.PUBLIC_URL}/video-test`} component={VideoTestHarness} exact />

					<Route path={`${process.env.PUBLIC_URL}/tools/raid-test`} component={RaidAlertTestHarness} exact />
					<Route path={`${process.env.PUBLIC_URL}/tools/video-test`} component={VideoTestHarness} exact />
					<Route path={`${process.env.PUBLIC_URL}/overlays/multi`} component={TwitchMultiOverlay} exact />
					<Route path={`${process.env.PUBLIC_URL}/overlays/death-counter`} component={DeathCounter} exact />
					<Route path={`${process.env.PUBLIC_URL}/overlays/sound-player`} component={SoundPlayer} exact />
					<Route path={`${process.env.PUBLIC_URL}/overlays/requests`} component={RequestQueue} exact />
					<Route path={`${process.env.PUBLIC_URL}/overlays/gauges`} component={Gauge} exact />
					<Route path={`${process.env.PUBLIC_URL}/overlays/mgauge`} component={MultiGauge} exact />
					<Route path={`${process.env.PUBLIC_URL}/`} component={Home} />
				</Switch>
			</Router>
		);
	}
}

export default App;
