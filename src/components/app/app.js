import React from 'react';

import Interval from '../interval/interval';

import classes from './app.css';

class App extends React.Component {
	render() {
		return (
			<div className={classes.App}>
				<Interval />
				<Interval />
			</div>
		);
	}
}

export default App;
