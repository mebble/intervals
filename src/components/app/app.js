import React from 'react';

import Interval from '../interval/interval';

import classes from './app.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.intervalCount = 1;  // equals the largest interval id created
		this.currentInterval = -1;  // index of interval undergoing countdown
		this.state = {
			intervals: [
				{
					id: this.intervalCount,
					totalSecs: 0,  // between 0 and 3600, mins in [0, 60], secs in [0, 59]
					counting: false
				}
			],
			counting: false
		};

		this.addInterval = this.addInterval.bind(this);
		this.removeInterval = this.removeInterval.bind(this);
		this.copyInterval = this.copyInterval.bind(this);
		this.updateIntervalTime = this.updateIntervalTime.bind(this);
		this.appCountDown = this.appCountDown.bind(this);
		this.intervalCountDown = this.intervalCountDown.bind(this);
		this.intervalDone = this.intervalDone.bind(this);
	}

	addInterval() {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		intervals.push({
			id: ++this.intervalCount,
			totalSecs: 0,
			counting: false
		});
		this.setState({
			intervals: intervals
		});
	}

	removeInterval(intervalId) {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		const index = intervals.findIndex(i => i.id === intervalId);
		intervals.splice(index, 1);
		this.setState({
			intervals: intervals
		});
	}

	copyInterval(intervalId) {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		const interval = intervals.find(i => i.id === intervalId);
		const index = intervals.indexOf(interval);
		intervals.splice(index + 1, 0, {
			id: ++this.intervalCount,
			totalSecs: interval.totalSecs,
			counting: false
		});
		this.setState({
			intervals: intervals
		});
	}

	updateIntervalTime(intervalId, totalSecs) {
		this.setState(prevState => {
			const intervals = prevState.intervals.map(i => Object.assign({}, i));
			const interval = intervals.find(i => i.id === intervalId);
			interval.totalSecs = totalSecs;
			return {
				intervals: intervals
			};
		});
	}

	appCountDown() {
		this.setState({ counting: true });
	}

	appDone() {
		this.setState(prevState => {
			const intervals = prevState.intervals.map(i => Object.assign({}, i));
			for (const i of intervals) {
				i.counting = false;  // switch_off
			}
			return {
				counting: false,
				intervals: intervals
			};
		});
	}

	intervalCountDown(intervalId) {
		this.setState(prevState => {
			const intervals = prevState.intervals.map(i => Object.assign({}, i));
			const interval = intervals.find(i => i.id === intervalId);
			interval.counting = true;  // switch_on
			return {
				intervals: intervals
			};
		});
	}

	intervalDone(intervalId) {
		this.setState(prevState => {
			const intervals = prevState.intervals.map(i => Object.assign({}, i));
			const interval = intervals.find(i => i.id === intervalId);
			const index = intervals.indexOf(interval);
			interval.counting = false;  // switch_off
			return {
				intervals: intervals
			};
		});

		console.log(this.state.intervals[this.currentInterval].id, 'is done');

		if (this.currentInterval >= this.state.intervals.length - 1) {
			this.setState({ counting: false });
			console.log('App is done!');
		} else {
			this.intervalCountDown(this.state.intervals[++this.currentInterval].id);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevState.counting && this.state.counting) {
			this.intervalCountDown(this.state.intervals[++this.currentInterval].id);
			console.log(this.state.intervals.map(i => i.counting));  // expected all false
		}
		if (prevState.counting && !this.state.counting) {
			this.currentInterval = -1;
			console.log(this.state.intervals.map(i => i.counting));  // expected all false
		}
	}

	render() {
		const { intervals, counting } = this.state;
		return (
			<div className={classes.App}>
				{intervals.map(i => <Interval key={i.id} id={i.id} totalSecs={i.totalSecs} appCounting={counting} counting={i.counting} done={this.intervalDone} onUpdateTime={this.updateIntervalTime} onCopy={this.copyInterval} onRemove={this.removeInterval} />)}
				<button onClick={() => !counting && this.addInterval()}>+</button>
				{counting ?
					<button onClick={() => counting && this.appDone()}>Stop</button> :
					<button onClick={() => !counting && intervals.length && this.appCountDown()}>Start</button>
				}
			</div>
		);
	}
}

export default App;
