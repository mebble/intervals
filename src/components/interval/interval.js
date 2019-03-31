import React, { useState } from "react";
import classnames from "classnames";

import "./interval.css";

import Input from "./input/input";
import Icon from "../icon/icon";
import { ICONS } from "../../constants";

function Interval({
  totalSecs,
  id,
  onUpdateTime,
  appCounting,
  counting,
  onCopy,
  onRemove,
  dragHandle
}) {
  const getSeconds = () => {
    return totalSecs % 60;
  };

  const getMinutes = () => {
    return Math.floor(totalSecs / 60);
  };

  const handleMinChange = event => {
    const seconds = getSeconds();
    const newVal = parseInt(event.target.value, 10);
    let newMin;
    if (isNaN(newVal) || newVal < 0) {
      newMin = 0; // true when input value starts with non-int or is negative
    } else if (newVal > 60 || (newVal === 60 && seconds > 0)) {
      return;
    } else {
      newMin = newVal;
    }

    const newTotal = newMin * 60 + seconds;
    onUpdateTime(id, newTotal);
  };

  const handleSecChange = event => {
    const minutes = getMinutes();
    const newVal = parseInt(event.target.value, 10);
    let newSec;
    if (isNaN(newVal) || newVal < 0) {
      newSec = 0; // true when input value starts with non-int or is negative
    } else if (newVal >= 60) {
      return;
    } else {
      newSec = newVal;
    }

    const newTotal = minutes * 60 + newSec;
    onUpdateTime(id, newTotal);
  };

  const increment = () => {
    const newTotal = totalSecs + 1 > 3600 ? totalSecs : totalSecs + 1;
    onUpdateTime(id, newTotal);
  };

  const decrement = () => {
    const newTotal = totalSecs - 1 < 0 ? 0 : totalSecs - 1;
    onUpdateTime(id, newTotal);
  };

  const DragHandle = dragHandle;
  const intervalClass = classnames("Interval", {
    "Interval--counting": counting
  });

  return (
    <div className={intervalClass}>
      {appCounting ? (
        <span className="Interval__elem Interval__title">
          <Icon
            appCounting={appCounting}
            intervalCounting={counting}
            icon={ICONS.MARK}
          />
        </span>
      ) : (
        <DragHandle />
      )}
      <button
        className="Interval__elem button btn-input"
        onClick={() => decrement()}
        disabled={appCounting}
      >
        <Icon appCounting={appCounting} icon={ICONS.MINUS} />
      </button>
      <Input
        leftValue={pad(getMinutes())}
        onLeftChange={e => !appCounting && handleMinChange(e)}
        rightValue={pad(getSeconds())}
        onRightChange={e => !appCounting && handleSecChange(e)}
      />
      <button
        className="Interval__elem button btn-input"
        onClick={() => increment()}
        disabled={appCounting}
      >
        <Icon appCounting={appCounting} icon={ICONS.PLUS} />
      </button>
      <button
        className="Interval__elem button btn-input"
        onClick={() => onCopy(id)}
        disabled={appCounting}
      >
        <Icon appCounting={appCounting} icon={ICONS.COPY} />
      </button>
      <button
        className="Interval__elem button btn-input"
        onClick={() => onRemove(id)}
        disabled={appCounting}
      >
        <Icon appCounting={appCounting} icon={ICONS.TRASH} />
      </button>
    </div>
  );
}

function pad(num) {
  let stringVal = num.toString();
  if (stringVal.length === 1) {
    stringVal = "0" + stringVal;
  }
  return stringVal;
}

export default Interval;
