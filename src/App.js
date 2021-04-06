import React from 'react';
import './App.css';


const fontSize = 32;

class App extends React.Component {
	state = {
		deaths: 0,
		textScale: 1,
		direction: 1
	}

	componentDidMount() {
		document.addEventListener("click", this.onDeath);
        document.addEventListener("contextmenu", this.onReset);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.onDeath);
        document.removeEventListener("contextmenu", this.onReset);
	}

	onReset = (e) => {
		this.setState({deaths: 0, textScale: 1, direction: 1});
		e.preventDefault();
		return false;
	}

	onDeath = (e) => {
		this.setState((prevState) => {
			return {
				deaths: prevState.deaths + 1,
				direction: 1,
				textScale: 1
			}
		});

		let interval = setInterval(() => {
			console.log("TEXT SCALE: " + this.state.textScale);
			console.log("DIRECTION:  " + this.state.direction);

			//If scaling up
			if (this.state.textScale <= 2 && this.state.direction > 0) {
				this.setState((prevState) => {
					return {
						textScale: Math.min(prevState.textScale + 0.1, 2)
					}
				});
			}

			// If scaling down
			if (this.state.textScale >= 1 && this.state.direction < 0) {
				this.setState((prevState) => {
					return {
						textScale: Math.max(prevState.textScale - 0.1, 1)
					}
				});
			}

			// If done animating up
			if (this.state.textScale >= 2 && this.state.direction > 0) {
				this.setState({direction: -1});
			}

			// If done animating down
			if (this.state.textScale <= 1 && this.state.direction < 0) {
				clearInterval(interval);
			}
		}, 10);
	}

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none"}} className="App">
				<span style={{fontWeight: "bolder", fontSize: `${this.state.textScale * fontSize}pt`, webkitTextStroke: "2px black", webkitTextFillColor: "white", lineHeight: "100vh", height: "100vh"}}>Deaths: {this.state.deaths}</span>
			</div>
		);
	}
}

export default App;
