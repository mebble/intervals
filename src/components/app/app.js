import React from 'react';

import Interval from '../interval/interval';

import classes from './app.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			intervals: [
				{ id: 0, counting: false }
			],
			counting: false
		};
		this.intervalCount = 1;  // equals the largest interval id created

		this.addInterval = this.addInterval.bind(this);
		this.removeInterval = this.removeInterval.bind(this);
		this.copyInterval = this.copyInterval.bind(this);
		this.appCountDown = this.appCountDown.bind(this);
		this.intervalCountDown = this.intervalCountDown.bind(this);
		this.intervalDone = this.intervalDone.bind(this);
	}

	addInterval() {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		intervals.push({
			id: ++this.intervalCount,
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
		const index = intervals.findIndex(i => i.id === intervalId);
		intervals.splice(index + 1, 0, {
			id: ++this.intervalCount,
			counting: false
		});
		this.setState({
			intervals: intervals
		});
	}

	appCountDown() {
		this.setState({ counting: true });
		this.intervalCountDown(this.state.intervals[0].id);
	}

	intervalCountDown(intervalId) {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		const interval = intervals.find(i => i.id === intervalId);
		interval.counting = true;
		this.setState({
			intervals: intervals
		});
	}

	intervalDone(intervalId) {
		const intervals = this.state.intervals.map(i => Object.assign({}, i));
		const interval = intervals.find(i => i.id === intervalId);
		const index = intervals.indexOf(interval);
		interval.counting = false;
		this.setState({
			intervals: intervals
		});

		if (index < this.state.intervals.length - 1) {
			this.intervalCountDown(intervals[index + 1].id);
		} else {
			this.setState({ counting: false });
			// console.log('App done counting!');
		}
	}

	render() {
		const { intervals, counting } = this.state;
		return (
			<div className={classes.App}>
				{intervals.map(i => <Interval key={i.id} id={i.id} appCounting={counting} counting={i.counting} done={this.intervalDone} onCopy={this.copyInterval} onRemove={this.removeInterval} />)}
				<button onClick={() => !counting && this.addInterval()}>+</button>
				<button onClick={() => !counting && intervals.length && this.appCountDown()}>Start</button>
			</div>
		);
	}
}

export default App;
