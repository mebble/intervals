import React from 'react';

import Interval from '../interval/interval';

import classes from './app.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			intervals: [
				{ counting: false },
				{ counting: false }
			],
			counting: false
		};

		this.addInterval = this.addInterval.bind(this);
		this.appCountDown = this.appCountDown.bind(this);
		this.intervalCountDown = this.intervalCountDown.bind(this);
		this.intervalDone = this.intervalDone.bind(this);
	}

	addInterval() {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		intervals.push({ counting: false });
		this.setState({
			intervals: intervals
		});
	}

	appCountDown() {
		this.setState({ counting: true });
		this.intervalCountDown(0);
	}

	intervalCountDown(intervalInd) {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		intervals[intervalInd].counting = true;
		this.setState({
			intervals: intervals
		});
	}

	intervalDone(intervalInd) {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		intervals[intervalInd].counting = false;
		this.setState({
			intervals: intervals
		});

		if (intervalInd < this.state.intervals.length - 1) {
			this.intervalCountDown(intervalInd + 1);
		} else {
			this.setState({ counting: false });
			// console.log('App done counting!');
		}
	}

	render() {
		const { intervals, counting } = this.state;
		return (
			<div className={classes.App}>
				{intervals.map((interval, i) => <Interval key={i} title={i} done={this.intervalDone} counting={interval.counting} />)}
				<button onClick={() => !counting && this.addInterval()}>+</button>
				<button onClick={() => !counting && this.appCountDown()}>Start</button>
			</div>
		);
	}
}

export default App;
