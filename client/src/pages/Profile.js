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
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    joinedGroups: []
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await axios.get('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data) {
          throw new Error('No data received from server');
        }

        if (response.data.success) {
          const userData = {
            ...response.data.user,
            joinedGroups: response.data.user.joinedGroups || []
          };

          setUserData(userData);
          setProfile(userData);

          if (userData.examDate) {
            setExamData({
              examName: userData.examName || '',
              examDate: new Date(userData.examDate).toISOString().split('T')[0]
            });
          } else {
            setExamData({ examName: '', examDate: '' });
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        setError(errorMessage);
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExamSubmit = async () => {
    try {
      // Format the date to ISO string
      const formattedDate = new Date(examData.examDate).toISOString();
      
      const response = await axios.put(
        '/api/auth/update-exam-date',
        {
          examName: examData.examName,
          examDate: formattedDate
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local state with the new exam details
        setUserData(prev => ({
          ...prev,
          examName: examData.examName,
          examDate: formattedDate
        }));
        
        setProfile(prev => ({
          ...prev,
          examName: examData.examName,
          examDate: formattedDate
        }));

        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);

        // Exit editing mode
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update exam details');
      }
    } catch (error) {
      console.error('Error updating exam details:', error);
      setError('Failed to update exam details. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleRemoveExam = async () => {
    try {
      // First update local state immediately
      setExamData({ examName: '', examDate: '' });
      setUserData(prev => ({
        ...prev,
        examName: '',
        examDate: null
      }));
      setProfile(prev => ({
        ...prev,
        examName: '',
        examDate: null
      }));
      setIsEditing(false);

      // Then make the API call
      await axios.delete('/api/auth/remove-exam', {  // Changed to DELETE method
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      // Force refresh the profile data
      const updatedResponse = await axios.get('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (updatedResponse.data.success) {
        const updatedUserData = {
          ...updatedResponse.data.user,
          examName: '',
          examDate: null
        };
        setUserData(updatedUserData);
        setProfile(updatedUserData);
      }

    } catch (error) {
      console.error('Error removing exam details:', error);
      // Even if API fails, keep the UI updated
      setError('Exam details removed from display. Please refresh the page.');
      setTimeout(() => {
        setError(null);
      }, 3000);
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
    <div className="main-container">
      <div className="profile-container">
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
          <div className="profile-column">
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
                    examName={userData.examName || 'Exam'}
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
                          <button 
                            onClick={() => setIsEditing(true)} 
                            className="edit-button"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={handleRemoveExam} 
                            className="remove-button"
                            disabled={!userData.examDate} // Disable if no exam
                          >
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
                            <p>{userData.examDate ? new Date(userData.examDate).toLocaleDateString() : ''}</p>
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

          <div className="groups-column">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
