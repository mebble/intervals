import React from 'react';

import './input.css';

const Input = props => (
	<div className="Input">
		<input className="Input__field" type="text" value={props.leftValue} onChange={props.onLeftChange} />
		<span className="Input__separator"></span>
		<input className="Input__field" type="text" value={props.rightValue} onChange={props.onRightChange} />
	</div>
);

export default Input;
