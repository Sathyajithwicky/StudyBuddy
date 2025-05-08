import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaUsers, FaClock, FaChartLine, FaCalendarAlt, FaTrophy, FaUserEdit } from 'react-icons/fa';
import StudyTimer from '../components/StudyTimer';

function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    studyProgress: {
      totalHours: 0,
      weeklyHours: 0,
      streak: 0,
      todayMinutes: 0
    },
    quizResults: [],
    examCountdown: null,
    recentActivity: []
  });

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      console.error('No token available');
      setError('Authentication required');
      return;
    }
    
    try {
      console.log('Fetching dashboard data with token:', token);
      const response = await axios.get('http://localhost:5001/api/users/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Dashboard response:', response.data);

      if (response.data.success) {
        console.log('Setting dashboard data:', response.data.dashboard);
        setDashboardData(prev => ({
          ...prev,
          ...response.data.dashboard
        }));
      } else {
        console.error('Dashboard request was not successful:', response.data);
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error.response || error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Handle study progress update
  const handleStudyComplete = async (updatedProgress) => {
    // Only update streak if study time is 60 minutes or more
    const newStreak = updatedProgress.todayMinutes >= 60 ? 
      (dashboardData.studyProgress.streak + 1) : 
      dashboardData.studyProgress.streak;

    const updatedData = {
      ...updatedProgress,
      streak: newStreak
    };

    // Update local state
    setDashboardData(prev => ({
      ...prev,
      studyProgress: updatedData
    }));

    // Send update to server
    try {
      await axios.put('http://localhost:5001/api/users/study-progress', 
        { studyProgress: updatedData },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error updating study progress:', error);
    }
  };

  // Calculate time remaining until exam
  useEffect(() => {
    if (!user?.examDate) return;

    const calculateTimeLeft = () => {
      const examTime = new Date(user.examDate).getTime();
      const now = new Date().getTime();
      const difference = examTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setDashboardData(prev => ({
          ...prev,
          examCountdown: { days, hours, minutes, seconds }
        }));
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [user?.examDate]);

  // Fetch data when component mounts and when it becomes visible
  useEffect(() => {
    console.log('Dashboard mounted or visibility changed');
    fetchDashboardData();

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Document became visible, fetching dashboard data');
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchDashboardData]);

  return (
    <>
      {loading ? (
        <div className="dashboard-loading">Loading dashboard...</div>
      ) : error ? (
        <div className="dashboard-error">{error}</div>
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.firstName || 'Student'}!</h1>
            <p>Track your study progress and achievements</p>
          </div>

          <div className="dashboard-grid">
            {/* Study Timer Card */}
            <div className="dashboard-card study-timer-card">
              <div className="card-header">
                <FaClock className="card-icon" />
                <h2>Study Timer</h2>
              </div>
              <div className="card-content">
                <StudyTimer 
                  onStudyComplete={handleStudyComplete} 
                  minimumForStreak={60} 
                  currentStreak={dashboardData.studyProgress?.streak || 0}
                />
              </div>
            </div>

            {/* Study Progress Card */}
            <div className="dashboard-card study-progress">
              <div className="card-header">
                <FaBook className="card-icon" />
                <h2>Study Progress</h2>
              </div>
              <div className="card-content">
                <div className="progress-stat">
                  <span className="stat-value">{Math.round(dashboardData.studyProgress?.totalHours || 0)}</span>
                  <span className="stat-label">Total Study Hours</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-value">{Math.round(dashboardData.studyProgress?.weeklyHours || 0)}</span>
                  <span className="stat-label">This Week</span>
                </div>
                <div className="progress-stat">
                  <div className="streak-container">
                    <span className="stat-value">{dashboardData.studyProgress?.streak || 0}</span>
                    <span className="stat-label">Day Streak 🔥</span>
                    <span className="today-time">
                      {dashboardData.studyProgress?.todayMinutes ? (
                        <>
                          {Math.round(dashboardData.studyProgress.todayMinutes)} mins today
                          {dashboardData.studyProgress.todayMinutes < 60 && (
                            <span className="streak-needed">
                              (Study 60+ minutes to maintain streak)
                            </span>
                          )}
                        </>
                      ) : (
                        'Study 60+ minutes to maintain streak!'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Results Card */}
            <div className="dashboard-card quiz-results">
              <div className="card-header">
                <FaChartLine className="card-icon" />
                <h2>Quiz Results</h2>
              </div>
              <div className="card-content">
                {(dashboardData.quizResults || []).map((quiz, index) => (
                  <div key={index} className="quiz-result">
                    <div className="quiz-info">
                      <span className="quiz-subject">{quiz.subject}</span>
                      <span className="quiz-score">{quiz.score}%</span>
                    </div>
                    <div className="quiz-date">{new Date(quiz.date).toLocaleDateString()}</div>
                  </div>
                ))}
                {(!dashboardData.quizResults || dashboardData.quizResults.length === 0) && (
                  <p className="no-data">No quiz results yet</p>
                )}
              </div>
            </div>

            {/* Exam Countdown Card */}
            {dashboardData.examCountdown && (
              <div className="dashboard-card exam-countdown">
                <div className="card-header">
                  <FaClock className="card-icon" />
                  <h2>Exam Countdown</h2>
                </div>
                <div className="card-content">
                  <div className="countdown-timer">
                    <div className="countdown-block">
                      <span className="countdown-value">{dashboardData.examCountdown.days}</span>
                      <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-block">
                      <span className="countdown-value">{dashboardData.examCountdown.hours}</span>
                      <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-block">
                      <span className="countdown-value">{dashboardData.examCountdown.minutes}</span>
                      <span className="countdown-label">Minutes</span>
                    </div>
                    <div className="countdown-block">
                      <span className="countdown-value">{dashboardData.examCountdown.seconds}</span>
                      <span className="countdown-label">Seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Card */}
            <div className="dashboard-card recent-activity">
              <div className="card-header">
                <FaCalendarAlt className="card-icon" />
                <h2>Recent Activity</h2>
              </div>
              <div className="card-content">
                {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
                  dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'quiz' && <FaChartLine />}
                        {activity.type === 'study' && <FaBook />}
                        {activity.type === 'profile' && <FaUserEdit />}
                      </div>
                      <div className="activity-details">
                        <p className="activity-description">{activity.description}</p>
                        <span className="activity-time">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;