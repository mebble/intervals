import React from 'react';
import classnames from 'classnames';

import Ring from '../../util/ring';
import Section from '../section/section';
import Interval from '../interval/interval';
import Icon from '../icon/icon';
import { ICONS } from '../../constants';

import './app.css';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class App extends React.Component {
	constructor(props) {
		super(props);
		this.intervalCount = 1;  // equals the largest interval id created
		this.currentInterval = -1;  // index of interval undergoing countdown
		this.ring = new Ring(audioContext);
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
		this.appStopped = this.appStopped.bind(this);
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

	appStopped() {
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
			this.ring.play(587.33, 2, 0.3);
			console.log('App is done!');
		} else {
			this.intervalCountDown(this.state.intervals[++this.currentInterval].id);
			this.ring.play(440, 2, 0.1);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevState.counting && this.state.counting) {
			this.intervalCountDown(this.state.intervals[++this.currentInterval].id);
			this.ring.play(698.46, 1, 0.1);
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
			<div className="App">
				{intervals.map(i => (
					<Section key={i.id}>
						<Interval
							id={i.id}
							totalSecs={i.totalSecs}
							appCounting={counting}
							counting={i.counting}
							done={this.intervalDone}
							onUpdateTime={this.updateIntervalTime}
							onCopy={this.copyInterval}
							onRemove={this.removeInterval} />
					</Section>
				))}
				<button
					className={classnames('button', 'btn-app', { 'btn-app--counting': counting })}
					onClick={() => !counting && this.addInterval()}
					disabled={counting}>
					<Icon appCounting={counting} icon={ICONS.PLUS} />
				</button>
				{counting ?
					<button
						className={classnames('button', 'btn-app', 'btn-app--counting')}
						onClick={() => counting && this.appStopped()}>
						<Icon icon={ICONS.STOP} />
					</button> :
					<button
						className={classnames('button', 'btn-app')}
						onClick={() => !counting && intervals.length && this.appCountDown()}
						disabled={counting}>
						<Icon icon={ICONS.PLAY} />
					</button>
				}
			</div>
		);
	}
}

export default App;
