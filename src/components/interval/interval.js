import React from 'react';

import Input from './input/input';

import classes from './interval.css';

class Interval extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			leftValue: 0,
			rightValue: 0,
		};

		this.handleLeftChange = this.handleLeftChange.bind(this);
		this.handleRightChange = this.handleRightChange.bind(this);
		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
	}

	handleLeftChange(event) {
		const newVal = parseInt(event.target.value, 10);
		if (isNaN(newVal)) return;

		this.setState({
			leftValue: newVal
		});
	}

	handleRightChange(event) {
		const newVal = parseInt(event.target.value, 10);
		if (isNaN(newVal)) return;

		this.setState({
			rightValue: newVal
		});
	}

	increment() {
		/* TODO - update rightValue on module 60 */
		const current = this.state.leftValue;
		this.setState({
			leftValue: current + 1
		});
	}

	decrement() {
		/* TODO - update rightValue on module 60 */
		const current = this.state.leftValue;
		this.setState({
			leftValue: current - 1
		});
	}

	render() {
		const { leftValue, rightValue } = this.state;
		return (
			<div className={classes.Interval}>
				<button
					className={`${classes['btn--dec']} ${classes.btn}`}
					onClick={this.decrement}
				>-</button>
				<Input
					leftValue={leftValue}
					rightValue={rightValue}
					onLeftChange={this.handleLeftChange}
					onRightChange={this.handleRightChange}
				/>
				<button
					className={`${classes['btn--inc']} ${classes.btn}`}
					onClick={this.increment}
				>+</button>
			</div>
		);
	}
};

export default Interval;
