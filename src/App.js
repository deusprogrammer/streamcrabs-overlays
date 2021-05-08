import React from 'react';
import './App.css';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DeathCounter from './routes/DeathCounter';
import SoundPlayer from './routes/SoundPlayer';
import Home from './routes/Home';
import RequestQueue from './routes/RequestQueue';
import TwitchMultiOverlay from './routes/multi/TwitchMultiOverlay';

class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path={`${process.env.PUBLIC_URL}/multi`} component={TwitchMultiOverlay} exact />
					<Route path={`${process.env.PUBLIC_URL}/death-counter`} component={DeathCounter} exact />
					<Route path={`${process.env.PUBLIC_URL}/sound-player`} component={SoundPlayer} exact />
					<Route path={`${process.env.PUBLIC_URL}/requests`} component={RequestQueue} exact />
					<Route path={`${process.env.PUBLIC_URL}/`} component={Home} />
				</Switch>
			</Router>
		);
	}
}

export default App;
