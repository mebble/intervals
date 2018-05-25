import React from 'react';

import Interval from '../interval/interval';

import classes from './app.css';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			intervals: [
				{ title: "1" },
				{ title: "2" }
			]
		};
	}
	render() {
		const { intervals } = this.state;
		return (
			<div className={classes.App}>
				{intervals.map(i => <Interval key={randString()} title={i.title} />)}
			</div>
		);
	}
}

function randString() {
	return Math.random().toString(36).slice(2, 7);
}

export default App;
