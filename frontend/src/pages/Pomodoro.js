import React, { useState, useEffect } from 'react';
import './Pomodoro.css';

function Pomodoro() {
  // Load settings from localStorage or use defaults
  const [minutes, setMinutes] = useState(() => {
    const savedMinutes = localStorage.getItem('pomodoro_minutes');
    return savedMinutes ? parseInt(savedMinutes) : 25;
  });
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState(() => {
    return localStorage.getItem('pomodoro_session_type') || 'work';
  }); // 'work' or 'break'
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Request fullscreen when component mounts
    const enterFullscreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    };

    // Add visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        // Alert user when they try to leave
        const notification = new Notification('Pomodoro Timer', {
          body: 'Please stay focused! Your timer is still running.',
          icon: '/favicon.ico'
        });
      }
    };

    // Add fullscreen change detection
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && isActive) {
        alert('Please maintain fullscreen mode during your Pomodoro session!');
        enterFullscreen();
      }
    };

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isActive]);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval);
            setIsActive(false);
            if (sessionType === 'work') {
              setSessionType('break');
              setMinutes(5); // 5 minutes break
            } else {
              setSessionType('work');
              setMinutes(25); // 25 minutes work
            }
            playAlarm();
            exitFullscreen();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, sessionType]);

  const toggleTimer = async () => {
    if (!isActive) {
      // Request fullscreen when starting timer
      const elem = document.documentElement;
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    }
    setIsActive(!isActive);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const resetTimer = () => {
    // Only reset if timer is active or values are different from default
    if (isActive || minutes !== 25 || seconds !== 0 || sessionType !== 'work') {
      setIsActive(false);
      setSessionType('work');
      setMinutes(25);
      setSeconds(0);
      exitFullscreen();
    }
  };

  const playAlarm = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();
  };

  const setCustomTime = (mins) => {
    setIsActive(false);
    setMinutes(mins);
    setSeconds(0);
    // Save to localStorage
    localStorage.setItem('pomodoro_minutes', mins.toString());
  };
  
  // Save session type to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pomodoro_session_type', sessionType);
  }, [sessionType]);

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-box">
        <h1>{sessionType === 'work' ? 'Work Time' : 'Break Time'}</h1>
        
        {!isFullscreen && !isActive && (
          <div className="fullscreen-notice">
            Please allow fullscreen mode for the best focus experience
          </div>
        )}

        <div className="timer-display">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="timer-controls">
          <button onClick={toggleTimer} className="control-btn">
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer} className="control-btn">
            Reset
          </button>
        </div>

        <div className="preset-times">
          <button onClick={() => setCustomTime(25)} className="preset-btn">
            25 min
          </button>
          <button onClick={() => setCustomTime(45)} className="preset-btn">
            45 min
          </button>
          <button onClick={() => setCustomTime(60)} className="preset-btn">
            60 min
          </button>
        </div>

        <div className="session-info">
          <p>Current Session: {sessionType === 'work' ? 'Work' : 'Break'}</p>
          <p>Next Session: {sessionType === 'work' ? 'Break' : 'Work'}</p>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
