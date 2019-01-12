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
			largestID: 0  // equals the largest interval id created
		};

		this.addInterval = this.addInterval.bind(this);
		this.removeInterval = this.removeInterval.bind(this);
		this.copyInterval = this.copyInterval.bind(this);
		this.updateIntervalTime = this.updateIntervalTime.bind(this);
		this.countDown = this.countDown.bind(this);
		this.stopCountDown = this.stopCountDown.bind(this);
		this.getNonZeroInterval = this.getNonZeroInterval.bind(this);
	}

	addInterval() {
		this.setState(prevState => {
			const { intervals, largestID } = prevState;
			const newLargestID = largestID + 1;
			const newIntervals = [...intervals, {
				id: newLargestID,
				time: 0
			}];
			return {
				intervals: newIntervals,
				largestID: newLargestID
			};
		});
	}

	removeInterval(intervalId) {
		this.setState(prevState => {
			const { intervals } = prevState;
			const newIntervals = intervals.filter(i => i.id !== intervalId);
			return {
				intervals: newIntervals
			};
		});
	}

	copyInterval(intervalId) {
		this.setState(prevState => {
			const { intervals, largestID } = prevState;
			const newIntervals = [...intervals];
			const interval = newIntervals.find(i => i.id === intervalId);
			const index = newIntervals.indexOf(interval);
			const newLargestID = largestID + 1;
			newIntervals.splice(index + 1, 0, {
				id: newLargestID,
				time: interval.time
			});
			return {
				intervals: newIntervals,
				largestID: newLargestID
			};
		});
	}

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
						this.ring.play(587.33, 2, 0.3);
						return {
							intervals: newIntervals,
							currentIndex: null,
							counterID: null,
							countingDown: false
						};
					} else {
						let nextIndex;
						try {
							nextIndex = this.getNonZeroInterval(newIntervals, currentIndex + 1);
						} catch (error) {
							console.log(error.message);
							clearInterval(counterID);
							this.ring.play(587.33, 2, 0.3);
							return {
								intervals: newIntervals,
								currentIndex: null,
								counterID: null,
								countingDown: false
							};
						}
						this.ring.play(440, 2, 0.1);
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
		});
		this.ring.play(698.46, 1, 0.1);
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
