import React from "react";

import "./input.css";

const Input = ({ leftValue, rightValue, onLeftChange, onRightChange }) => (
  <div className="Input">
    <input
      className="Input__field"
      type="text"
      value={leftValue}
      onChange={onLeftChange}
      aria-label="Number of Minutes"
    />
    <span className="Input__separator" />
    <input
      className="Input__field"
      type="text"
      value={rightValue}
      onChange={onRightChange}
      aria-label="Number of Seconds"
    />
  </div>
);

export default Input;
