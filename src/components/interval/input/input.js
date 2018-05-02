import React from 'react';

import classes from './input.css';

const Input = (props) => {
	return (
		<div className={classes.Input}>
			<input type="text" value={props.leftValue} onChange={props.onLeftChange} />
			<span>:</span>
			<input type="text" value={props.rightValue} onChange={props.onRightChange} />
		</div>
	);
};

export default Input;
