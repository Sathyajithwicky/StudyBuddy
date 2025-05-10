import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Reviews.css';

const Reviews = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!token) {
          setError('Please log in to view your feedback');
          setLoading(false);
          return;
        }

        // Try different endpoints to find the correct one
        let response;
        try {
          // First try the feedback endpoint
          response = await axios.get('/api/feedback', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (err) {
          // If that fails, try the all endpoint
          response = await axios.get('/api/feedback/all', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        console.log('Feedback response:', response.data);

        // Handle different response formats
        if (response.data && response.data.feedback) {
          setReviews(response.data.feedback);
        } else if (response.data && Array.isArray(response.data)) {
          setReviews(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // If it's an object with multiple properties, try to find an array
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            setReviews(possibleArrays[0]);
          } else {
            // If no arrays found, create an array with the single object
            setReviews([response.data]);
          }
        } else {
          setReviews([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Failed to load your feedback. Please try again later.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  // If there's no data, show a message to create feedback
  const handleCreateFeedback = () => {
    window.location.href = '/feedback';
  };

  return (
    <div className="reviews-container">
      <h2>My Feedback</h2>
      <p className="reviews-subtitle">Your submitted feedback and reviews</p>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : reviews && reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <h3>{review.feedbackType || 'General Feedback'}</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= (review.rating || 0) ? 'selected' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="review-content">
                <p className="review-message">{review.message || 'No message provided'}</p>
                {review.suggestions && (
                  <div className="review-suggestions">
                    <h4>Suggestions:</h4>
                    <p>{review.suggestions}</p>
                  </div>
                )}
              </div>
              <div className="review-footer">
                <span className="review-date">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}
                </span>
                {!review.isAnonymous && review.name && (
                  <span className="review-author">
                    Submitted by: {review.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reviews">
          <p>You haven't submitted any feedback yet.</p>
          <button onClick={handleCreateFeedback} className="submit-feedback-link">
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews; 