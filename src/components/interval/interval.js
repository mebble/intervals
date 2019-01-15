import React from "react";
import classnames from "classnames";

import "./interval.css";

import Input from "./input/input";
import Icon from "../icon/icon";
import { ICONS } from "../../constants";

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
      newMin = 0; // true when input value starts with non-int or is negative
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
      newSec = 0; // true when input value starts with non-int or is negative
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
    const newTotal = totalSecs + 1 > 3600 ? totalSecs : totalSecs + 1;
    this.props.onUpdateTime(this.props.id, newTotal);
  }

  decrement() {
    const { totalSecs } = this.props;
    const newTotal = totalSecs - 1 < 0 ? 0 : totalSecs - 1;
    this.props.onUpdateTime(this.props.id, newTotal);
  }

  render() {
    const { appCounting, counting, id } = this.props;
    const { onCopy, onRemove } = this.props;
    const DragHandle = this.props.dragHandle;
    const intervalClass = classnames("Interval", {
      "Interval--counting": counting,
    });

    return (
      <div className={intervalClass}>
        <span className="Interval__elem Interval__title">
          {appCounting ? (
            <Icon
              appCounting={appCounting}
              intervalCounting={counting}
              icon={ICONS.MARK}
            />
          ) : (
            <DragHandle />
          )}
        </span>
        <button
          className="Interval__elem button btn-input"
          onClick={() => this.decrement()}
          disabled={appCounting}
        >
          <Icon appCounting={appCounting} icon={ICONS.MINUS} />
        </button>
        <Input
          leftValue={pad(this.getMinutes())}
          onLeftChange={e => !appCounting && this.handleMinChange(e)}
          rightValue={pad(this.getSeconds())}
          onRightChange={e => !appCounting && this.handleSecChange(e)}
        />
        <button
          className="Interval__elem button btn-input"
          onClick={() => this.increment()}
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
}

function pad(num) {
  let stringVal = num.toString();
  if (stringVal.length === 1) {
    stringVal = "0" + stringVal;
  }
  return stringVal;
}

export default Interval;
