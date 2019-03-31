import React from "react";

import "./input.css";

const Input = ({ leftValue, rightValue, onLeftChange, onRightChange }) => (
  <div className="Input">
    <input
      className="Input__field"
      type="text"
      value={leftValue}
      onChange={onLeftChange}
    />
    <span className="Input__separator" />
    <input
      className="Input__field"
      type="text"
      value={rightValue}
      onChange={onRightChange}
    />
  </div>
);

export default Input;
