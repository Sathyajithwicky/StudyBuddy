import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import home_image from "../assets/bwink_edu_07_single_06.jpg";
import home_image2 from "../assets/bwink_edu_09_single_04.jpg";
import home_image3 from "../assets/bwink_edu_05_single_07.jpg";
import home_image4 from "../assets/bwink_edu_01_single_04.jpg";
import home_image5 from "../assets/bwink_ppl_01_single_01.jpg";
import countdown from "../assets/countdown.png";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import "./Homepage.css";

function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fetch user data including exam date
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5001/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUserData(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Calculate time remaining until exam
  useEffect(() => {
    if (!userData?.examDate) return;

    const calculateTimeLeft = () => {
      const examTime = new Date(userData.examDate).getTime();
      const now = new Date().getTime();
      const difference = examTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [userData?.examDate]);

  // Add handler for pomodoro button - accessible without login
  const handlePomodoroClick = () => {
    navigate('/pomodoro');
  };

  return (
    <div className="main-container">
      {/* Hero Section with split layout */}
      
      <div className="hero-section">
        <div className="left-content">
        
          <h1>Welcome to StudyBuddy!</h1>
          <p>Your all-in-one platform for study groups, exam prep, and focus tools.</p>
          
          <div className="buttons">
            <Link to="/Pomodoro" className="btn">Pomodoro Timer</Link>
            <Link to="/join-group" className="btn">Join a Study Group</Link>
          </div>
          
        </div>
        <div className="right-content">
            <div>
            <img src={home_image} alt="Study Illustration" className="hero-image" />
            </div>
          
        </div>
        
        
  
      </div>
      {/* Countdown Section */}
      {userData?.examDate && (
        <div className="countdown-section">
          <h2>Time Until {userData.examName}</h2>
          <div className="countdown-timer">
            <div className="time-block">
              <span className="time">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="label">Days</span>
            </div>
            <div className="time-block">
              <span className="time">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="label">Hours</span>
            </div>
            <div className="time-block">
              <span className="time">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="label">Minutes</span>
            </div>
            <div className="time-block">
              <span className="time">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="label">Seconds</span>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="features-section">
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-text-container">
              <p className="feature-text">Create & Join Study Groups</p>
              <p className="feature-subtext">Connect with students in your subject</p>
              <button className="join-btn" onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: '/join-group' } });
                } else {
                  navigate('/join-group');
                }
              }}>Join Group</button>
            </div>
            
            <img src={home_image2} alt="Study Illustration" className="feature-image" />
          </div>

          <div className="feature-item">
          <img src={home_image3} alt="Study Illustration" className="feature-image" />
            <div className="feature-text-container2">
              <p className="feature-text2">Shared Notes & Resources</p>
              <p className="feature-subtext2">Upload and download study materials</p>
            </div>
            
          </div>

          <div className="feature-item">
            <div className="feature-text-container">
              <p className="feature-text">Pomodoro Timer</p>
              <p className="feature-subtext">Stay focused with structured study sessions</p>
              <button className="join-btn" onClick={handlePomodoroClick}>Pomodoro Timer</button>
            </div>
            <img src={home_image5} alt="Study Illustration" className="feature-image" />
          </div>

          <div className="feature-item">
            <div className="video-container">
              <iframe
                width="480"
                height="270"
                src="https://www.youtube.com/embed/SLKGgBf3s9E"
                title="Study With Me"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="feature-text-container2">
              <p className="feature-text2">Study With Me</p>
              <p className="feature-subtext2">Study with virtual study buddies</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-text-container">
              <p className="feature-text">Q&A Discussion Forum</p>
              <p className="feature-subtext">Ask and answer academic questions</p>
            </div>
            <img src={home_image4} alt="Study Illustration" className="feature-image" />
          </div>

          <div className="feature-item">
          <img src={countdown} alt="Study Illustration" className="feature-image" />
            <div className="feature-text-container2">
              <p className="feature-text2">Exam Countdown</p>
              <p className="feature-subtext2">Never miss an exam deadline</p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="motivation-section">
        <h2>We Believe in Your Success!</h2>
        <p className="motivation-text">
          Study hard, stay focused, and achieve your dreams!
        </p>
        <p className="quote">
          "The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt
        </p>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2>Need Help?</h2>
        <p>Having trouble? Need assistance? Contact us at <a href="mailto:support@studybuddy.com">support@studybuddy.com</a></p>
        <Link to="/faq" className="faq-link">Check our FAQ</Link>
      </div>
    </div>      
  );
}

export default HomePage;
