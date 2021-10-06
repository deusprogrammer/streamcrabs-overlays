import React from 'react';
import './App.css';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DeathCounter from './routes/DeathCounter';
import Home from './routes/Home';
import RequestQueue from './routes/RequestQueue';
import TwitchMultiOverlay from './routes/multi/TwitchMultiOverlay';
import CustomSoundPlayer from './routes/CustomSoundPlayer';
import SpeechSynthesisTester from './routes/SpeechSynthesisTester';
import WhatTheDub from './routes/WhatTheDub';
import RaidAlert from './routes/RaidAlert';

class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path={`${process.env.PUBLIC_URL}/wtd`} component={WhatTheDub} exact />
					<Route path={`${process.env.PUBLIC_URL}/speech/test`} component={SpeechSynthesisTester} exact />
					<Route path={`${process.env.PUBLIC_URL}/multi`} component={TwitchMultiOverlay} exact />
					<Route path={`${process.env.PUBLIC_URL}/death-counter`} component={DeathCounter} exact />
					<Route path={`${process.env.PUBLIC_URL}/sound-player`} component={CustomSoundPlayer} exact />
					<Route path={`${process.env.PUBLIC_URL}/requests`} component={RequestQueue} exact />
					<Route path={`${process.env.PUBLIC_URL}/raid-test`} component={RaidAlert} exact />
					<Route path={`${process.env.PUBLIC_URL}/`} component={Home} />
				</Switch>
			</Router>
		);
	}
}

export default App;
