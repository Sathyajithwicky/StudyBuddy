import React, { useState, useEffect } from 'react';
import './ExamCountdown.css';
import PropTypes from 'prop-types';

const ExamCountdown = ({ examDate, examName }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Memoize the countdown calculation
  const calculateTimeLeft = React.useCallback(() => {
    try {
      const examTime = new Date(examDate).getTime();
      const now = new Date().getTime();
      const difference = examTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    } catch (error) {
      console.error('Error calculating time left:', error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }, [examDate]);

  useEffect(() => {
    if (!examDate) {
      return;
    }

    // Calculate immediately
    const timeLeft = calculateTimeLeft();
    setTimeLeft(timeLeft);

    // Update every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!examDate) {
    return null;
  }

  // Show a message if exam date has passed
  if (timeLeft.days === 0 && timeLeft.hours === 0 && 
      timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="exam-countdown">
        <h3>{examName} has passed</h3>
      </div>
    );
  }

  return (
    <div className="exam-countdown">
      <h4>Countdown to {examName}</h4>
      <div className="countdown-timer">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

ExamCountdown.propTypes = {
  examDate: PropTypes.string.isRequired,
  examName: PropTypes.string.isRequired
};

export default ExamCountdown; 