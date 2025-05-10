import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Feedback.css';

const Feedback = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'General',
    rating: 5,
    message: '',
    suggestions: '',
    isAnonymous: false
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setErrorMessage('Please log in to submit feedback');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
      return;
    }

    try {
      const response = await axios.post('/api/feedback/submit', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setShowSuccessPopup(true);
        setFormData({
          name: '',
          email: '',
          feedbackType: 'General',
          rating: 5,
          message: '',
          suggestions: '',
          isAnonymous: false
        });
        setTimeout(() => setShowSuccessPopup(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to submit feedback');
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    }
  };

  return (
    <div className="feedback-container">
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <div className="success-icon">✓</div>
            <h3>Thank You!</h3>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="error-popup">
          <div className="error-popup-content">
            <div className="error-icon">✕</div>
            <h3>Error</h3>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="feedback-form-container">
        <h2>Share Your Feedback</h2>
        <p className="feedback-subtitle">Help us improve your experience</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!formData.isAnonymous}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!formData.isAnonymous}
              />
            </div>

            <div className="form-group">
              <label>Feedback Type</label>
              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                required
              >
                <option value="General">General Feedback</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Study Group Feedback">Study Group Feedback</option>
              </select>
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= formData.rating ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, rating: star })}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Please share your thoughts..."
              />
            </div>

            <div className="form-group full-width">
              <label>Suggestions for Improvement</label>
              <textarea
                name="suggestions"
                value={formData.suggestions}
                onChange={handleChange}
                rows="3"
                placeholder="How can we make your experience better?"
              />
            </div>

            <div className="form-group checkbox-group full-width">
              <label>
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                />
                Submit Anonymously
              </label>
            </div>

            <div className="form-group full-width">
              <button type="submit" className="submit-button">
                Submit Feedback
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
