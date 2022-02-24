import { useState, useEffect, useRef } from "react";

import useInterval from "./useInterval.js";

import "./App.css";
import settingsIcon from "./assets/images/gear.svg";

const initialDuration = 900;
const formatTime = (time) => {
  if (time === 0) return "00";
  else if (time < 10) return "0" + time;
  else return time;
};
const getMin = (duration) => Math.floor(duration / 60);
const getSec = (duration) => duration % 60;

function App() {
  //single source of truth
  const [duration, setDuration] = useState(initialDuration);
  //'standby','editing','running'
  const [mode, setMode] = useState("idle");
  const minInputRef = useRef();

  const [min, setMin] = useState(Math.floor(initialDuration / 60));
  const [sec, setSec] = useState(initialDuration % 60);

  useInterval(
    () => {
      setDuration(duration - 1);
    },
    mode === "running" ? 1000 : null
  );

  useEffect(() => {
    setMin(formatTime(getMin(duration)));
    setSec(formatTime(getSec(duration)));
  }, [duration]);

  const changeDuration = () => {
    setDuration(min * 60 + sec);
    setMin(formatTime(getMin(duration)));
    setSec(formatTime(getSec(duration)));
    console.log(getMin(duration));
    console.log(min * 60);
    console.log(formatTime(getMin(duration)));
    setMode("standby");
  };

  const changeMin = (e) => {
    const value = e.target.value;
    if (value === "") setMin("");
    else {
      !Number.isNaN(parseInt(value)) && setMin(parseInt(value));
    }
  };

  const changeSec = (e) => {
    const value = e.target.value;
    if (value === "") setSec("");
    else {
      !Number.isNaN(parseInt(value)) && setSec(parseInt(value));
    }
  };

  return (
    <div className="wrapper">
      <div className="ring">
        <svg width="518" height="518" viewBox="0 0 518 518">
          <circle strokeWidth="9px" x="0" y="y" cx="259" cy="259" r="254" />
        </svg>
      </div>

      <div className="timer">
        <div className="time">
          <div
            className="minutes"
            onClick={() => {
              setMode("editing");
              setTimeout(() => {
                minInputRef.current.focus();
              }, 0);
            }}
          >
            <input
              type="text"
              value={min}
              disabled={mode !== "editing"}
              onChange={changeMin}
              onBlur={changeDuration}
              maxLength={2}
              ref={minInputRef}
            />
          </div>
          <div className="colon">:</div>
          <div className="seconds" onClick={() => setMode("editing")}>
            <input
              type="text"
              value={sec}
              disabled={mode !== "editing"}
              onChange={changeSec}
              onBlur={changeDuration}
              maxLength={2}
            />
          </div>
        </div>
        <button
          className="start"
          onClick={() =>
            setMode((mode) => (mode === "running" ? "standby" : "running"))
          }
        >
          {mode === "running" ? "pause" : "start"}
        </button>
        <button className="settings">
          <img src={settingsIcon} alt="Settings" />
        </button>
      </div>
    </div>
  );
}

export default App;
