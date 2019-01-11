import React from 'react';
import classnames from 'classnames';

import './app.css';

import Ring from '../../util/ring';
import Header from '../header/header';
import Section from '../section/section';
import Interval from '../interval/interval';
import Icon from '../icon/icon';
import { ICONS } from '../../constants';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class App extends React.Component {
	constructor(props) {
		super(props);
		// this.currentInterval = -1;  // index of interval undergoing countdown
		this.ring = new Ring(audioContext);
		this.state = {
			intervals: [
				{
					id: 0,
					time: 0,  // between 0 and 3600, mins in [0, 60], secs in [0, 59]
				}
			],
			countingDown: false,
			currentIndex: null,  // the index of the current interval counting down
			counterID: null,  // the setInterval counter ID,
			largestID: 1  // equals the largest interval id created
		};

		this.addInterval = this.addInterval.bind(this);
		this.removeInterval = this.removeInterval.bind(this);
		this.copyInterval = this.copyInterval.bind(this);
		this.updateIntervalTime = this.updateIntervalTime.bind(this);
		this.countDown = this.countDown.bind(this);
		this.stopCountDown = this.stopCountDown.bind(this);
		// this.appCountDown = this.appCountDown.bind(this);
		// this.appStopped = this.appStopped.bind(this);
		// this.appDone = this.appDone.bind(this);
		// this.intervalCountDown = this.intervalCountDown.bind(this);
		// this.intervalDone = this.intervalDone.bind(this);
		this.getNonZeroInterval = this.getNonZeroInterval.bind(this);
	}

	addInterval() {
		this.setState(prevState => {
			const { intervals, largestID } = prevState;
			const newIntervals = [...intervals, {
				id: largestID + 1,
				time: 0
			}];
			return newIntervals;
		});
	}

	removeInterval(intervalId) {
		this.setState(prevState => {
			const { intervals } = prevState;
			const newIntervals = intervals.filter(i.id !== intervalId);
			return newIntervals;
		});
	}

	copyInterval(intervalId) {
		console.log('wanna copy')
		this.setState(prevState => {
			const { intervals, largestID } = prevState;
			const newIntervals = [...intervals];
			const interval = newIntervals.find(i => i.id === intervalId);
			const index = newIntervals.indexOf(interval);
			newIntervals.splice(index + 1, 0, {
				id: largestID + 1,
				time: interval.time
			});
		});
	}

	// appCountDown() {
	// 	const { intervals } = this.state;

	// 	if (!intervals.some(i => i.totalSecs > 0)) return;

	// 	this.setState({ counting: true });
	// 	this.ring.play(698.46, 1, 0.1);
	// }

	// appStopped() {
	// 	this.setState(prevState => {
	// 		const intervals = prevState.intervals.map(i => Object.assign({}, i));
	// 		for (const i of intervals) {
	// 			i.counting = false;  // switch_off
	// 		}
	// 		return {
	// 			counting: false,
	// 			intervals: intervals
	// 		};
	// 	});
	// }

	// appDone() {
	// 	this.ring.play(587.33, 2, 0.3);
	// 	this.setState({ counting: false });
	// 	console.log('App is done!');
	// }

	// intervalCountDown(index) {
	// 	this.setState(prevState => {
	// 		const intervals = prevState.intervals.map(i => Object.assign({}, i));
	// 		intervals[index].counting = true;  // switch_on
	// 		return {
	// 			intervals: intervals
	// 		};
	// 	});
	// }

	updateIntervalTime(intervalId, newTime) {
		this.setState(prevState => {
			const { intervals } = prevState;
			const newIntervals = [...intervals];
			const interval = newIntervals.find(i => i.id === intervalId);
			interval.time = newTime;
			return {
				intervals: newIntervals
			};
		});
	}

	// intervalDone(intervalId) {
	// 	this.setState(prevState => {
	// 		const intervals = prevState.intervals.map(i => Object.assign({}, i));
	// 		const interval = intervals.find(i => i.id === intervalId);
	// 		interval.counting = false;  // switch_off
	// 		return {
	// 			intervals: intervals
	// 		};
	// 	});

	// 	console.log(this.state.intervals[this.currentInterval].id, 'is done');

	// 	this.currentInterval = this.getNonZeroInterval(this.state, this.currentInterval + 1);  // won't get updated 'interval counting' state, but updated totalSeconds
	// 	if (this.currentInterval === -1) {
	// 		this.appDone();
	// 	} else {
	// 		this.ring.play(440, 2, 0.1);
	// 		this.intervalCountDown(this.currentInterval);
	// 	}
	// }

	getNonZeroInterval(intervals, index) {
		/**
		 * Return the index of first non zero interval at or after that at 'index'
		 */
		while (index < intervals.length) {
			const interval = intervals[index];
			if (interval.time > 0) {
				return index;
			}
			index++;
		}
		throw new Error('No non-zero interval present!');
	}

	componentDidUpdate(prevProps, prevState) {
		// if (!prevState.counting && this.state.counting) {
		// 	this.currentInterval = this.getNonZeroInterval(this.state, this.currentInterval + 1);
		// 	if (this.currentInterval === -1) {
		// 		this.appDone();
		// 		return;
		// 	}
		// 	this.intervalCountDown(this.currentInterval);
		// 	console.log(this.state.intervals.map(i => i.counting));  // expected all false
		// }
		// if (prevState.counting && !this.state.counting) {
		// 	this.currentInterval = -1;
		// 	console.log(this.state.intervals.map(i => i.counting));  // expected all false
		// }
	}

	countDown() {
		const { intervals } = this.state;
		let currentIndex;
		try {
			currentIndex = this.getNonZeroInterval(intervals, 0);
		} catch (error) {
			console.log(error.message);
			return;
		}
		const counterID = setInterval(() => {
			this.setState(prevState => {
				const { intervals, currentIndex, counterID } = prevState;
				const newIntervals = [...intervals];
				const current = newIntervals[currentIndex];
				current.time--;  // assume: interval at currentIndex is of non-zero time

				if (current.time === 0) {
					const lastIndex = newIntervals.length - 1;
					if (currentIndex === lastIndex) {
						clearInterval(counterID);
						return {
							intervals: newIntervals,
							currentIndex: null,
							counterID: null,
							countingDown: false
						};
					} else {
						let next;
						try {
							nextIndex = this.getNonZeroInterval(newIntervals, currentIndex + 1);
						} catch (error) {
							console.log(error.message);
							clearInterval(counterID);
							return {
								intervals: newIntervals,
								currentIndex: null,
								counterID: null,
								countingDown: false
							};
						}
						return {
							intervals: newIntervals,
							currentIndex: nextIndex
						};
					}
				} else {
					return {
						intervals: newIntervals
					};
				}
			});
		}, 1000);
		this.setState({
			currentIndex,
			counterID,
			countingDown: true
		})
	}

	stopCountDown() {
		const { counterID } = this.state;
		clearInterval(counterID);
		this.setState({
			currentIndex: null,
			counterID: null,
			countingDown: false
		});
	}

	render() {
		const { intervals, countingDown } = this.state;

		return (
			<div className="App">
				<Section>
					<Header title="Intervals" />
				</Section>
				{intervals.map(i => (
					<Section key={i.id}>
						<Interval
							id={i.id}
							totalSecs={i.time}
							appCounting={countingDown}
							// counting={i.counting}
							// done={this.intervalDone}
							onUpdateTime={this.updateIntervalTime}
							onCopy={this.copyInterval}
							onRemove={this.removeInterval} />
					</Section>
				))}
				<Section>
					<button
						className={classnames('button', 'btn-app', { 'btn-app--counting': countingDown })}
						onClick={() => this.addInterval()}
						disabled={countingDown}>
						<Icon appCounting={countingDown} icon={ICONS.PLUS} />
					</button>
				</Section>
				<Section>
					{countingDown ?
						<button
							className={classnames('button', 'btn-app', 'btn-app--counting')}
							onClick={() => this.stopCountDown()}>
							<Icon icon={ICONS.STOP} />
						</button> :
						<button
							className={classnames('button', 'btn-app')}
							onClick={() => this.countDown()}
							disabled={countingDown}>
							<Icon icon={ICONS.PLAY} />
						</button>
					}
				</Section>
			</div>
		);
	}
}

export default App;
