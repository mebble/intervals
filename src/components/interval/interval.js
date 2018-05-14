import React from 'react';

import Input from './input/input';

import classes from './interval.css';

class Interval extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			totalSeconds: 0,  // between 0 and 3600
			minutes: 0,  // between 0 and 60
			seconds: 0,  // between 0 and 59
		};

		this.handleMinChange = this.handleMinChange.bind(this);
		this.handleSecChange = this.handleSecChange.bind(this);
		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
		this.updateTime = this.updateTime.bind(this);
	}

	handleMinChange(event) {
		const { seconds } = this.state;
		const newVal = parseInt(event.target.value, 10);
		let newMin;
		if (isNaN(newVal) || newVal < 0) {
			newMin = 0;  // true when input value starts with non-int or is negative
		} else if (newVal > 60 || (newVal === 60 && seconds > 0)) {
			return;
		} else {
			newMin = newVal;
		}

		const newTotal = newMin * 60 + seconds;
		this.updateTime(newTotal);
	}

	handleSecChange(event) {
		const { minutes } = this.state;
		const newVal = parseInt(event.target.value, 10);
		let newSec;
		if (isNaN(newVal) || newVal < 0) {
			newSec = 0;  // true when input value starts with non-int or is negative
		} else if (newVal >= 60) {
			return;
		} else {
			newSec = newVal;
		}

		const newTotal = minutes * 60 + newSec;
		this.updateTime(newTotal);
	}

	increment() {
		const { totalSeconds } = this.state;
		const newTotal = (totalSeconds + 1) > 3600 ? totalSeconds : totalSeconds + 1;
		this.updateTime(newTotal);
	}

	decrement() {
		const { totalSeconds } = this.state;
		const newTotal = (totalSeconds - 1) < 0 ? 0 : totalSeconds - 1;
		this.updateTime(newTotal);
	}

	updateTime(newTotalSecs) {
		this.setState({
			totalSeconds: newTotalSecs,
			minutes:  Math.floor(newTotalSecs / 60),
			seconds: newTotalSecs % 60
		});
		// console.log(newTotalSecs);
	}

	render() {
		const { minutes, seconds } = this.state;
		return (
			<div className={classes.Interval}>
				<button
					className={`${classes['btn--dec']} ${classes.btn}`}
					onClick={this.decrement}
				>-</button>
				<Input
					leftValue={pad(minutes)}
					onLeftChange={this.handleMinChange}
					rightValue={pad(seconds)}
					onRightChange={this.handleSecChange}
				/>
				<button
					className={`${classes['btn--inc']} ${classes.btn}`}
					onClick={this.increment}
				>+</button>
			</div>
		);
	}
};

function pad(num) {
	let stringVal = num.toString();
	if (stringVal.length === 1) {
		stringVal = '0' + stringVal;
	}
	return stringVal;
}

export default Interval;
