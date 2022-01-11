import React from 'react';

class GifPlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        let audio = new Audio(this.props.soundUrl);
        audio.volume = this.props.volume;
        audio.addEventListener("ended", () => {
            this.props.onComplete();
        });
        await audio.play();
    }

	render() {
		return (
            <img src={this.props.url} />
		);
	}
}

export default GifPlayer;
