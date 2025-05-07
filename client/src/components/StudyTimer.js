import React from 'react';
import { useStudyTimer } from '../context/StudyTimerContext';
import './StudyTimer.css';

const StudyTimer = ({ onStudyComplete }) => {
  const { isRunning, time, formatTime, handleStartStop, handleReset } = useStudyTimer();

  return (
    <div className="study-timer">
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <button 
          className={`timer-button ${isRunning ? 'stop' : 'start'}`}
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button 
          className="timer-button reset"
          onClick={() => handleReset(onStudyComplete)}
          disabled={time === 0}
        >
          Save & Reset
        </button>
      </div>
    </div>
  );
};

export default StudyTimer; 