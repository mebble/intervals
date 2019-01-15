import React from "react";
import classnames from "classnames";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
  arrayMove,
} from "react-sortable-hoc";

import "./app.css";

import ring from "../../util/ring";
import Header from "../header/header";
import Footer from "../footer/footer";
import Section from "../section/section";
import Interval from "../interval/interval";
import Icon from "../icon/icon";
import { ICONS, NOTES } from "../../constants";
import { saveObject, getSavedObject } from "../../util/storage";

const DragHandle = sortableHandle(() => <Icon icon={ICONS.DRAG} />);
const SortableInterval = sortableElement(({ value }) => (
  <Section>
    <Interval dragHandle={DragHandle} {...value} />
  </Section>
));
const SortableIntervalContainer = sortableContainer(({ children }) => (
  <ul className="IntervalContainer">{children}</ul>
));
class App extends React.Component {
  constructor(props) {
    super(props);
    const savedIntervals = getSavedObject("intervals");
    const savedIntervalsInCount = getSavedObject("intervalsInCount");
    const paused = savedIntervalsInCount ? true : false;
    const countingDown = savedIntervalsInCount ? true : false;
    this.state = {
      countingDown,
      paused,
      intervals: savedIntervals || [
        {
          id: 0,
          time: 0, // between 0 and 3600, mins in [0, 60], secs in [0, 59]
        },
      ],
      intervalsInCount: savedIntervalsInCount,
      currentIndex: null, // the index of the current interval counting down
      counterID: null, // the setInterval counter ID,
      largestID: 0, // equals the largest interval id created
    };

    this.addInterval = this.addInterval.bind(this);
    this.removeInterval = this.removeInterval.bind(this);
    this.copyInterval = this.copyInterval.bind(this);
    this.updateIntervalTime = this.updateIntervalTime.bind(this);
    this.countDown = this.countDown.bind(this);
    this.stopCountDown = this.stopCountDown.bind(this);
    this.getNonZeroInterval = this.getNonZeroInterval.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  addInterval() {
    if (this.state.countingDown) {
      return;
    }
    this.setState(prevState => {
      const { intervals, largestID } = prevState;
      const newLargestID = largestID + 1;
      const newIntervals = [
        ...intervals,
        {
          id: newLargestID,
          time: 0,
        },
      ];
      return {
        intervals: newIntervals,
        largestID: newLargestID,
      };
    });
  }

  removeInterval(intervalId) {
    if (this.state.countingDown) {
      return;
    }
    this.setState(prevState => {
      const { intervals, intervalsInCount } = prevState;
      const newIntervals = intervals.filter(i => i.id !== intervalId);
      const newIntervalsInCount = intervalsInCount
        ? intervalsInCount.filter(i => i.id !== intervalId)
        : null;
      return {
        intervals: newIntervals,
        intervalsInCount: newIntervalsInCount,
      };
    });
  }

  copyInterval(intervalId) {
    if (this.state.countingDown) {
      return;
    }
    this.setState(prevState => {
      const { intervals, largestID } = prevState;
      const newIntervals = [...intervals];
      const interval = newIntervals.find(i => i.id === intervalId);
      const index = newIntervals.indexOf(interval);
      const newLargestID = largestID + 1;
      newIntervals.splice(index + 1, 0, {
        id: newLargestID,
        time: interval.time,
      });
      return {
        intervals: newIntervals,
        largestID: newLargestID,
      };
    });
  }

  updateIntervalTime(intervalId, newTime) {
    if (this.state.countingDown) {
      return;
    }
    this.setState(prevState => {
      const { intervals } = prevState;
      const newIntervals = [...intervals];
      const interval = newIntervals.find(i => i.id === intervalId);
      interval.time = newTime;
      return {
        intervals: newIntervals,
      };
    });
  }

  getNonZeroInterval(intervals, index) {
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
  }

  countDown() {
    const {
      intervals,
      intervalsInCount: intervalsInCountFromState,
    } = this.state;

    const intervalsInCount = intervalsInCountFromState
      ? intervalsInCountFromState
      : intervals.map(i => ({ ...i }));

    let currentIndex;
    try {
      currentIndex = this.getNonZeroInterval(intervalsInCount, 0);
    } catch (error) {
      console.log(error.message);
      return;
    }
    const counterID = setInterval(() => {
      this.setState(prevState => {
        const { intervalsInCount, currentIndex, counterID } = prevState;
        const newIntervals = [...intervalsInCount];
        const current = newIntervals[currentIndex];
        current.time--; // assume: interval at currentIndex is of non-zero time

        if (current.time === 0) {
          const lastIndex = newIntervals.length - 1;
          if (currentIndex === lastIndex) {
            clearInterval(counterID);
            ring.play(NOTES.a5, 3, 0.1);
            return {
              intervalsInCount: null,
              currentIndex: null,
              counterID: null,
              countingDown: false,
              paused: true,
            };
          } else {
            let nextIndex;
            try {
              nextIndex = this.getNonZeroInterval(
                newIntervals,
                currentIndex + 1,
              );
            } catch (error) {
              console.log(error.message);
              clearInterval(counterID);
              ring.play(NOTES.a5, 3, 0.1);
              return {
                intervalsInCount: null,
                currentIndex: null,
                counterID: null,
                countingDown: false,
                paused: false,
              };
            }
            ring.play(NOTES.e5, 2, 0.08);
            return {
              intervalsInCount: newIntervals,
              currentIndex: nextIndex,
              paused: false,
            };
          }
        } else {
          return {
            intervalsInCount: newIntervals,
            paused: false,
          };
        }
      });
    }, 1000);
    this.setState({
      currentIndex,
      counterID,
      countingDown: true,
      intervalsInCount: intervalsInCount,
    });
    ring.play(NOTES.c5, 1, 0.1);
  }

  stopCountDown() {
    const { counterID } = this.state;
    clearInterval(counterID);
    this.setState({
      currentIndex: null,
      counterID: null,
      intervalsInCount: null,
      countingDown: false,
    });
  }

  pauseCountDown() {
    const { counterID } = this.state;
    clearInterval(counterID);
    this.setState({
      counterID: null,
      paused: true,
    });
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState(prevState => {
      const { intervals } = prevState;
      return {
        intervals: arrayMove(intervals, oldIndex, newIndex),
      };
    });
  }

  componentDidUpdate(_prevProps, _prevState) {
    const { intervals, intervalsInCount } = this.state;
    saveObject("intervals", intervals);
    saveObject("intervalsInCount", intervalsInCount);
  }

  render() {
    const {
      intervals,
      intervalsInCount,
      countingDown,
      currentIndex,
      paused,
    } = this.state;
    const intervalsToDisplay = intervalsInCount ? intervalsInCount : intervals;

    return (
      <div className="App">
        <Section>
          <Header title="Intervals" />
        </Section>
        <SortableIntervalContainer
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          transitionDuration={200}
          lockToContainerEdges
          lockOffset="0%"
          useDragHandle
        >
          {intervalsToDisplay.map((i, index) => {
            const config = {
              id: i.id,
              totalSecs: i.time,
              appCounting: countingDown,
              counting: index === currentIndex,
              onUpdateTime: this.updateIntervalTime,
              onCopy: this.copyInterval,
              onRemove: this.removeInterval,
            };
            return <SortableInterval key={i.id} index={index} value={config} />;
          })}
        </SortableIntervalContainer>
        <Section>
          <button
            className={classnames("button", "btn-app")}
            onClick={() => this.addInterval()}
            disabled={countingDown}
          >
            <Icon appCounting={countingDown} icon={ICONS.PLUS} />
          </button>
          <button
            className={classnames("button", "btn-app")}
            onClick={() => this.stopCountDown()}
          >
            <Icon icon={ICONS.STOP} />
          </button>
          {paused ? (
            <button
              className={classnames("button", "btn-app")}
              onClick={() => this.countDown()}
            >
              <Icon icon={ICONS.PLAY} />
            </button>
          ) : (
            <button
              className={classnames("button", "btn-app")}
              onClick={() => this.pauseCountDown()}
            >
              Pause icon here
              <Icon icon={ICONS.PAUSE} />
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
}

export default App;
