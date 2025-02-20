import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import ExamCountdown from '../components/ExamCountdown';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examData, setExamData] = useState({
    examName: '',
    examDate: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setUserData(response.data.user);
          if (response.data.user.examDate) {
            setExamData({
              examName: response.data.user.examName,
              examDate: new Date(response.data.user.examDate).toISOString().split('T')[0]
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          logout(); // Token expired or invalid
          navigate('/login');
        } else {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, logout, navigate]);

  const handleExamChange = async (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExamSubmit = async () => {
    try {
      const response = await axios.put(
        '/api/auth/update-exam-date',
        examData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setUserData(prev => ({
        ...prev,
        examName: response.data.examDetails.examName,
        examDate: response.data.examDetails.examDate
      }));

      setShowSuccessMessage(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating exam details:', error);
      setError('Failed to update exam details');
    }
  };

  const handleRemoveExam = async () => {
    try {
      await axios.put(
        '/api/auth/remove-exam',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setExamData({ examName: '', examDate: '' });
      setUserData(prev => ({
        ...prev,
        examName: '',
        examDate: null
      }));
      setShowSuccessMessage(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error removing exam details:', error);
      setError('Failed to remove exam details');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!userData) return <div className="profile-error">No user data found</div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="profile-container">
      {showSuccessMessage && (
        <div className="success-message">
          Exam details updated successfully!
        </div>
      )}
      
      <div className="profile-card">
        <h2>User Profile</h2>
        
       

        <div className="profile-info">
          <div className="profile-header">
            <div className="profile-avatar">
              {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
            </div>
            <h3>{userData?.firstName} {userData?.lastName}</h3>
          </div>
          {userData?.examDate && (
          <ExamCountdown 
            examDate={userData.examDate}
            examName={userData.examName}
          />
        )}
          <div className="profile-details">
            <div className="detail-item">
              <label>Email</label>
              <p>{userData?.email}</p>
            </div>
            <div className="detail-item">
              <label>Course</label>
              <p>{userData?.course}</p>
            </div>
            <div className="detail-item">
              <label>University</label>
              <p>{userData?.university}</p>
            </div>
            <div className="detail-item">
              <label>Member Since</label>
              <p>{new Date(userData?.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="detail-item exam-details">
              <div className="exam-header">
                <h4>Exam Details</h4>
                {userData?.examDate && !isEditing && (
                  <div className="exam-actions">
                    <button onClick={() => setIsEditing(true)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={handleRemoveExam} className="remove-button">
                      Remove
                    </button>
                  </div>
                )}
              </div>
              
              {!userData?.examDate ? (
                !isEditing && (
                  <>
                    <div className="exam-input-group">
                      <label>Exam Name</label>
                      <input
                        type="text"
                        name="examName"
                        value={examData.examName}
                        onChange={handleExamChange}
                        placeholder="Enter exam name"
                        className="exam-input"
                      />
                    </div>
                    <div className="exam-input-group">
                      <label>Exam Date</label>
                      <input
                        type="date"
                        name="examDate"
                        value={examData.examDate}
                        onChange={handleExamChange}
                        min={today}
                        className="date-input"
                      />
                    </div>
                    <button 
                      className="update-exam-button"
                      onClick={handleExamSubmit}
                      disabled={!examData.examName || !examData.examDate}
                    >
                      Add Exam Details
                    </button>
                  </>
                )
              ) : (
                isEditing ? (
                  <>
                    <div className="exam-input-group">
                      <label>Exam Name</label>
                      <input
                        type="text"
                        name="examName"
                        value={examData.examName}
                        onChange={handleExamChange}
                        className="exam-input"
                      />
                    </div>
                    <div className="exam-input-group">
                      <label>Exam Date</label>
                      <input
                        type="date"
                        name="examDate"
                        value={examData.examDate}
                        onChange={handleExamChange}
                        min={today}
                        className="date-input"
                      />
                    </div>
                    <div className="exam-buttons">
                      <button 
                        className="update-exam-button"
                        onClick={handleExamSubmit}
                        disabled={!examData.examName || !examData.examDate}
                      >
                        Update Exam Details
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={() => {
                          setIsEditing(false);
                          setExamData({
                            examName: userData?.examName || '',
                            examDate: userData?.examDate ? userData.examDate.split('T')[0] : ''
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="exam-display">
                    <div className="exam-info">
                      <label>Exam Name:</label>
                      <p>{userData.examName}</p>
                    </div>
                    <div className="exam-info">
                      <label>Exam Date:</label>
                      <p>{new Date(userData.examDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
