import React from 'react';

import Interval from '../interval/interval';

import classes from './app.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			intervals: [
				{ number: 1 },
				{ number: 2 }
			]
		};

		this.addInterval = this.addInterval.bind(this);
	}

	addInterval() {
		const intervals = this.state.intervals.slice();
		const lastNum = intervals[intervals.length - 1].number;
		intervals.push({ number: lastNum + 1 });
		this.setState({
			intervals: intervals
		});
	}

	render() {
		const { intervals } = this.state;
		return (
			<div className={classes.App}>
				{intervals.map(i => <Interval key={randString()} title={i.number} />)}
				<button onClick={this.addInterval}>+</button>
			</div>
		);
	}
}

function randString() {
	return Math.random().toString(36).slice(2, 7);
}

export default App;
