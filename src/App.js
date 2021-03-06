import { useState, useEffect, useRef } from "react";

import useInterval from "./useInterval.js";

import "./App.css";
import settingsIcon from "./assets/images/gear.svg";

const initialDuration = 900;
const formatTime = (time) => {
  if (time === 0 || "") return "00";
  else if (time < 10) return "0" + time;
  else return time;
};
const getMin = (duration) => Math.floor(duration / 60);
const getSec = (duration) => duration % 60;
const isNum = (val) => /^\d+$/.test(val);

function App() {
  const [duration, setDuration] = useState(initialDuration);
  //'standby','editing','running'
  const [running, setRunning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editMin, setEditMin] = useState();
  const [editSec, setEditSec] = useState();

  const min = formatTime(getMin(duration));
  const sec = formatTime(getSec(duration));

  useInterval(
    () => {
      if (duration === 0) {
        setRunning(false);
        alert("Time's up!");
      } else setDuration(duration - 1);
    },
    running ? 1000 : null
  );

  const enterEditMode = () => {
    setEditing(true);
    setEditMin(min);
    setEditSec(sec);
  };

  const changeMin = (e) => {
    const value = e.target.value;
    if (value === "") setEditMin("");
    else isNum(value) && setEditMin(value);
  };

  const changeSec = (e) => {
    const value = e.target.value;
    if (value === "") setEditSec("");
    else isNum(value) && setEditSec(value);
  };

  const userModifyDuration = () => {
    setEditing(false);
    const min = editMin === "" ? 0 : parseInt(editMin);
    const sec = editSec === "" ? 0 : parseInt(editSec);
    setDuration(min * 60 + sec);
  };

  return (
    <div className="wrapper">
      <div className={duration === 0 ? "ring ending" : "ring"}>
        <svg width="518" height="518" viewBox="0 0 518 518">
          <circle strokeWidth="9px" x="0" y="y" cx="259" cy="259" r="254" />
        </svg>
      </div>

      <div className="timer">
        <div className="time">
          <div className="minutes">
            {editing ? (
              <input
                type="text"
                maxLength={2}
                value={editMin}
                onChange={changeMin}
                onBlur={userModifyDuration}
              />
            ) : (
              <input
                type="text"
                value={min}
                disabled={running}
                onChange={changeMin}
                maxLength={2}
                onClick={enterEditMode}
              />
            )}
          </div>
          <div className="colon">:</div>
          <div className="seconds">
            {editing ? (
              <input
                type="text"
                maxLength={2}
                value={editSec}
                onChange={changeSec}
                onBlur={userModifyDuration}
              />
            ) : (
              <input
                type="text"
                value={sec}
                disabled={running}
                onChange={changeSec}
                maxLength={2}
                onClick={enterEditMode}
              />
            )}
          </div>
        </div>
        <button
          className="start"
          onClick={() => setRunning((running) => !running)}
        >
          {running ? "pause" : "start"}
        </button>
        <button className="settings">
          <img src={settingsIcon} alt="Settings" />
        </button>
      </div>
    </div>
  );
}

export default App;
