import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Reviews.css';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Updated to use the feedback endpoint
        const response = await axios.get('/api/feedback/my-feedback', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Check if response has data
        if (response.data && response.data.feedback) {
          setReviews(response.data.feedback);
        } else {
          throw new Error('No feedback data received');
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError(error.response?.data?.message || 'Failed to load your feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  if (loading) {
    return (
      <div className="reviews-container">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <h2>User Reviews</h2>
      {reviews && reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <h3>{review.feedbackType || 'General Feedback'}</h3>
                <div className="review-rating">
                  {review.rating && (
                    <>
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </>
                  )}
                </div>
              </div>
              <p className="review-message">{review.message}</p>
              {review.suggestions && (
                <p className="review-suggestions">
                  <strong>Suggestions:</strong> {review.suggestions}
                </p>
              )}
              <div className="review-date">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date not available'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-reviews">No reviews found. Share your feedback to see it here!</p>
      )}
    </div>
  );
}

export default Reviews; 