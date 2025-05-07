import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const StudyTimerContext = createContext();

export const StudyTimerProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = async (onStudyComplete) => {
    if (time > 0) {
      try {
        // Convert seconds to minutes
        const studyDuration = Math.round(time / 60);
        
        const response = await axios.post(
          'http://localhost:5001/api/users/study-progress',
          { studyDuration },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success && onStudyComplete) {
          onStudyComplete(response.data.studyProgress);
        }
      } catch (error) {
        console.error('Error updating study progress:', error);
      }
    }
    setTime(0);
    setIsRunning(false);
  };

  return (
    <StudyTimerContext.Provider 
      value={{ 
        isRunning, 
        time, 
        formatTime, 
        handleStartStop, 
        handleReset 
      }}
    >
      {children}
    </StudyTimerContext.Provider>
  );
};

export const useStudyTimer = () => {
  const context = useContext(StudyTimerContext);
  if (!context) {
    throw new Error('useStudyTimer must be used within a StudyTimerProvider');
  }
  return context;
}; 