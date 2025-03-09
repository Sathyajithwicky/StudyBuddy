import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import ExamCountdown from '../components/ExamCountdown';

export const userService = {
  getProfile: async (token) => {
    const response = await axios.get('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
  
  updateExam: async (token, examData) => {
    const response = await axios.put('/api/auth/update-exam-date', examData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [examData, setExamData] = useState({
    examName: '',
    examDate: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.user);
          
          if (response.data.user.examDate) {
            setExamData({
              examName: response.data.user.examName || '',
              examDate: new Date(response.data.user.examDate).toISOString().split('T')[0]
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('Failed to load user profile. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, logout, navigate]);

  const handleExamChange = (e) => {
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

      if (response.data.success) {
        setUserData(prev => ({
          ...prev,
          examName: examData.examName,
          examDate: examData.examDate
        }));
        
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating exam details:', error);
      setError('Failed to update exam details');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleRemoveExam = async () => {
    try {
      const response = await axios.delete(
        '/api/auth/remove-exam',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setUserData(prev => ({
          ...prev,
          examName: '',
          examDate: null
        }));
        
        setExamData({
          examName: '',
          examDate: ''
        });
        
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error removing exam details:', error);
      setError('Failed to remove exam details. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="main-container">
      {showSuccessMessage && (
        <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 1050 }}>
          {userData?.examDate ? 'Exam details updated successfully!' : 'Exam removed successfully!'}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 1050 }}>
          {error}
        </div>
      )}
      
      <div className="two-column-layout">
        {/* Left column - Profile */}
        <div className="profile-column">
          <div className="profile-card">
            <h2>User Profile</h2>
            <div className="profile-details">
              <div className="detail-item">
                <label>Username:</label>
                <p>{userData.username}</p>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <p>{userData.email}</p>
              </div>
              
              {/* Exam Details Section */}
              <div className="detail-item exam-details">
                <div className="exam-header">
                  <h4>Exam Details</h4>
                  {userData?.examDate && !isEditing && (
                    <div className="exam-actions">
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={handleRemoveExam} 
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="exam-form">
                    <div className="form-group">
                      <label>Exam Name:</label>
                      <input
                        type="text"
                        name="examName"
                        value={examData.examName}
                        onChange={handleExamChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Exam Date:</label>
                      <input
                        type="date"
                        name="examDate"
                        value={examData.examDate}
                        onChange={handleExamChange}
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        onClick={handleExamSubmit} 
                        className="save-button"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)} 
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : userData.examDate ? (
                  <div className="exam-display">
                    <div className="exam-info">
                      <label>Exam Name:</label>
                      <p>{userData.examName}</p>
                    </div>
                    <div className="exam-info">
                      <label>Exam Date:</label>
                      <p>{new Date(userData.examDate).toLocaleDateString()}</p>
                    </div>
                    
                    {/* Countdown Component */}
                    <ExamCountdown 
                      examDate={userData.examDate}
                      examName={userData.examName}
                    />
                  </div>
                ) : (
                  <div className="no-exam">
                    <p>No exam scheduled.</p>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="add-button"
                    >
                      Add Exam
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Groups */}
        <div className="groups-column">
          <div className="joined-section">
            <h3>Joined Groups</h3>
            <div className="row">
              {userData?.joinedGroups?.length > 0 ? (
                userData.joinedGroups.map(group => (
                  <div className="col-12 mb-3" key={group._id}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{group.name}</h5>
                        <p className="card-text">{group.description}</p>
                        <p className="card-text">
                          <small className="text-muted">Category: {group.category}</small>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p>You haven't joined any groups yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="favourite-section">
            <h3>Favourite Groups</h3>
            <div className="row">
              {userData?.favouriteGroups?.length > 0 ? (
                userData.favouriteGroups.map(group => (
                  <div className="col-12 mb-3" key={group._id}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{group.name}</h5>
                        <p className="card-text">{group.description}</p>
                        <p className="card-text">
                          <small className="text-muted">Category: {group.category}</small>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p>You haven't added any groups to your favorites yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
