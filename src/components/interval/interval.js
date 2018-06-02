import React from 'react';

import Input from './input/input';

import classes from './interval.css';

class Interval extends React.Component {
	constructor(props) {
		super(props);
		this.countingId = null;

		this.getSeconds = this.getSeconds.bind(this);
		this.getMinutes = this.getMinutes.bind(this);
		this.handleMinChange = this.handleMinChange.bind(this);
		this.handleSecChange = this.handleSecChange.bind(this);
		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
		this.countDown = this.countDown.bind(this);
	}

	getSeconds() {
		const { totalSecs } = this.props;
		return totalSecs % 60;
	}

	getMinutes() {
		const { totalSecs } = this.props;
		return Math.floor(totalSecs / 60);
	}

	handleMinChange(event) {
		const seconds = this.getSeconds();
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
		this.props.onUpdateTime(this.props.id, newTotal);
	}

	handleSecChange(event) {
		const minutes = this.getMinutes();
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
		this.props.onUpdateTime(this.props.id, newTotal);
	}

	increment() {
		const { totalSecs } = this.props;
		const newTotal = (totalSecs + 1) > 3600 ? totalSecs : totalSecs + 1;
		this.props.onUpdateTime(this.props.id, newTotal);
	}

	decrement() {
		const { totalSecs } = this.props;
		console.log('Before dec:', totalSecs);
		const newTotal = (totalSecs - 1) < 0 ? 0 : totalSecs - 1;
		this.props.onUpdateTime(this.props.id, newTotal);
	}

	countDown() {
		this.countingId = setInterval(() => {
			this.decrement();
			// decrement -> setState -> render -> componentDidUpdate cycle happens syncronously
			// Hence, totalSecs is guaranteed to be the updated value
			const { totalSecs } = this.props;
			console.log('After dec:', totalSecs);
			if (totalSecs <= 0) {
				clearInterval(this.countingId);
				this.props.done(this.props.id);
			}
		}, 1000);
		if (this.props.totalSecs <= 0) {
			clearInterval(this.countingId);
			this.props.done(this.props.id);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (!prevProps.counting && this.props.counting) {
			this.countDown();  // setting state in compDidUpdate. Not a prob if proper conditions are checked
		}
	}

	componentWillUnmount() {
		clearInterval(this.countingId);
	}

	render() {
		const { appCounting } = this.props;
		return (
			<div className={classes.Interval}>
				<h3 className={classes.title}>{this.props.id}</h3>
				<button
					className={`${classes['btn--dec']} ${classes.btn}`}
					onClick={() => !appCounting && this.decrement()}
				>-</button>
				<Input
					leftValue={pad(this.getMinutes())}
					onLeftChange={e => !appCounting && this.handleMinChange(e)}
					rightValue={pad(this.getSeconds())}
					onRightChange={e => !appCounting && this.handleSecChange(e)}
				/>
				<button
					className={`${classes['btn--inc']} ${classes.btn}`}
					onClick={() => !appCounting && this.increment()}
				>+</button>
				<button onClick={() => !appCounting && this.props.onCopy(this.props.id)}>cp</button>
				<button onClick={() => !appCounting && this.props.onRemove(this.props.id)}>x</button>
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
