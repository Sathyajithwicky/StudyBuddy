import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewFeedback.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReviewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        if (!token) {
          setError('Please log in to view feedback');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5001/api/feedback/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setFeedbacks(response.data.feedbacks);
        } else {
          setError('Failed to fetch feedback data');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
          setError('Session expired. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'Error fetching feedback data');
        }
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [token, logout, navigate]);

  if (loading) return (
    <div className="review-feedback-container">
      <div className="loading-state">Loading feedbacks...</div>
    </div>
  );

  if (error) return (
    <div className="review-feedback-container">
      <div className="error-state">{error}</div>
    </div>
  );

  if (!feedbacks || feedbacks.length === 0) return (
    <div className="review-feedback-container">
      <h2>User Feedback</h2>
      <div className="empty-state">No feedback available yet.</div>
    </div>
  );

  return (
    <div className="review-feedback-container">
      <h2>User Feedback</h2>
      <div className="feedback-list">
        {feedbacks.map((feedback, index) => (
          <div key={feedback._id || index} className="feedback-item">
            <div className="feedback-header">
              <h3>{feedback.name || 'Anonymous'}</h3>
              <span className="rating">Rating: {feedback.rating}/5</span>
            </div>
            <div className="feedback-details">
              <p><strong>Type:</strong> {feedback.feedbackType}</p>
              <p><strong>Email:</strong> {feedback.isAnonymous ? 'Anonymous' : feedback.email}</p>
            </div>
            <p className="feedback-text">{feedback.message}</p>
            {feedback.suggestions && (
              <div className="feedback-suggestions">
                <strong>Suggestions:</strong>
                <p>{feedback.suggestions}</p>
              </div>
            )}
            <div className="feedback-meta">
              <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewFeedback;