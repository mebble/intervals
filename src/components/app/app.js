import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
  arrayMove
} from "react-sortable-hoc";

import "./app.css";

import ring from "../../util/ring";
import Header from "../header/header";
import Footer from "../footer/footer";
import Section from "../section/section";
import Interval from "../interval/interval";
import Icon from "../icon/icon";
import { ICONS, NOTES } from "../../constants";

const DragHandle = sortableHandle(() => (
  <span className="Interval__elem Interval__title">
    <Icon icon={ICONS.DRAG} />
  </span>
));

const SortableInterval = sortableElement(({ value }) => (
  <Section>
    <Interval dragHandle={DragHandle} {...value} />
  </Section>
));
const SortableIntervalContainer = sortableContainer(({ children }) => (
  <ul className="IntervalContainer">{children}</ul>
));

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  const [intervals, setIntervals] = useState([{ id: 0, time: 0 }]);
  const [intervalsInCount, setIntervalsInCount] = useState(null);
  const [countingDown, setCountingDown] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [largestID, setLargestID] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const delay = 1000;
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      startInterval();
    },
    isRunning ? delay : null
  );

  const addInterval = () => {
    const newLargestID = largestID + 1;
    const newIntervals = [
      ...intervals,
      {
        id: newLargestID,
        time: 0
      }
    ];
    setIntervals(newIntervals);
    setLargestID(newLargestID);
  };

  const removeInterval = intervalId => {
    const newIntervals = intervals.filter(i => i.id !== intervalId);
    setIntervals(newIntervals);
  };

  const copyInterval = intervalId => {
    const newIntervals = [...intervals];
    const interval = newIntervals.find(i => i.id === intervalId);
    const index = newIntervals.indexOf(interval);
    const newLargestID = largestID + 1;
    newIntervals.splice(index + 1, 0, {
      id: newLargestID,
      time: interval.time
    });
    setIntervals(newIntervals);
    setLargestID(newLargestID);
  };

  const updateIntervalTime = (intervalId, newTime) => {
    const newIntervals = [...intervals];
    const interval = newIntervals.find(i => i.id === intervalId);
    interval.time = newTime;
    setIntervals(newIntervals);
  };

  const getNonZeroInterval = (intervals, index) => {
    /**
     * Return the index of first non zero interval at or after that at 'index'
     */
    while (index < intervals.length) {
      const interval = intervals[index];
      if (interval.time > 0) {
        return index;
      }
      index++;
    }
    throw new Error("No non-zero interval present!");
  };

  const startInterval = () => {
    if (intervalsInCount) {
      const newIntervals = [...intervalsInCount];
      const current = newIntervals[currentIndex];
      // current.time--; // assume: interval at currentIndex is of non-zero time
      current.time--;

      while (current.time <= 3 && current.time > 0) {
        ring.play(NOTES.e5, 1, 0.08);
        break;
      }
      if (current.time === 0) {
        const lastIndex = newIntervals.length - 1;
        if (currentIndex === lastIndex) {
          setIsRunning(false);
          ring.play(NOTES.a5, 3, 0.1);
          setIntervalsInCount(null);
          setCurrentIndex(null);
          setCountingDown(false);
        } else {
          let nextIndex;
          try {
            nextIndex = getNonZeroInterval(newIntervals, currentIndex + 1);
          } catch (error) {
            setIsRunning(false);
            ring.play(NOTES.a5, 3, 0.1);
            setIntervalsInCount(null);
            setCurrentIndex(null);
            setCountingDown(false);
          }
          ring.play(NOTES.e5, 2, 0.08);
          setIntervalsInCount(newIntervals);
          setCurrentIndex(nextIndex);
        }
      } else {
        setIntervalsInCount(newIntervals);
      }
    }
  };

  const startCountDown = () => {
    const newIntervalsInCount = intervals.map(i => ({ ...i }));
    let newCurrentIndex;
    try {
      newCurrentIndex = getNonZeroInterval(newIntervalsInCount, 0);
    } catch (error) {
      console.log(error.message);
      return;
    }

    setIsRunning(true);

    setCurrentIndex(newCurrentIndex);
    setCountingDown(true);
    setIntervalsInCount(newIntervalsInCount);
    ring.play(NOTES.c5, 1, 0.1);
  };

  const stopCountDown = () => {
    setIsRunning(false);
    setCurrentIndex(null);
    setIntervalsInCount(null);
    setIsPaused(false);
    setCountingDown(false);
  };

  const pauseCountDown = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resumeCountDown = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setIntervals(arrayMove(intervals, oldIndex, newIndex));
  };

  const intervalsToDisplay = countingDown ? intervalsInCount : intervals;

  return (
    <div className="App">
      <Section>
        <Header title="Intervals" />
      </Section>
      <SortableIntervalContainer
        onSortEnd={onSortEnd}
        lockAxis="y"
        transitionDuration={200}
        lockToContainerEdges
        lockOffset="0%"
        useDragHandle
      >
        {intervalsToDisplay &&
          intervalsToDisplay.map((i, index) => {
            const config = {
              id: i.id,
              totalSecs: i.time,
              appCounting: countingDown,
              counting: index === currentIndex,
              onUpdateTime: updateIntervalTime,
              onCopy: copyInterval,
              onRemove: removeInterval
            };
            return <SortableInterval key={i.id} index={index} value={config} />;
          })}
      </SortableIntervalContainer>
      <Section>
        <button
          className={classnames("button", "btn-app")}
          onClick={() => addInterval()}
          disabled={countingDown}
          aria-label="Add an Interval"
        >
          <Icon appCounting={countingDown} icon={ICONS.PLUS} />
        </button>
        {countingDown &&
          (isPaused ? (
            <button
              className={classnames("button", "btn-app")}
              onClick={() => resumeCountDown()}
              aria-label="Pause the current interval"
            >
              <Icon icon={ICONS.PLAY} />
            </button>
          ) : (
            <button
              className={classnames("button", "btn-app")}
              onClick={() => pauseCountDown()}
              aria-label="Pause the current interval"
            >
              <Icon icon={ICONS.PAUSE} />
            </button>
          ))}
        {countingDown ? (
          <button
            className={classnames("button", "btn-app")}
            onClick={() => stopCountDown()}
            aria-label="Stop the current interval"
          >
            <Icon icon={ICONS.STOP} />
          </button>
        ) : (
          <button
            className={classnames("button", "btn-app")}
            onClick={() => startCountDown()}
            aria-label="Start the interval"
          >
            <Icon icon={ICONS.PLAY} />
          </button>
        )}
      </Section>
      <Section>
        <Footer>
          Made by{" "}
          <a href="https://github.com/mebble">
            mebble <Icon icon={ICONS.GITHUB} />
          </a>
          <br />
          Fork me <a href="https://github.com/mebble/intervals">here</a>
        </Footer>
      </Section>
    </div>
  );
}

export default App;
