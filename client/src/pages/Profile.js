import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaUserFriends, FaTrashAlt } from 'react-icons/fa';

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
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    university: '',
    course: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Add state for user's study groups
  const [myStudyGroups, setMyStudyGroups] = useState([]);
  
  // Add state for countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // Quiz data for the right column
  const quizData = [
    { level: 'Advanced Level', subject: 'Physics', attempted: '10/100', average: '60%' },
    { level: 'Advanced Level', subject: 'Physics', attempted: '10/100', average: '60%' },
    { level: 'Advanced Level', subject: 'Physics', attempted: '10/100', average: '60%' }
  ];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // FIRST: Immediately try to get data from localStorage when component mounts
  useEffect(() => {
    // Try to get exam data from localStorage first
    try {
      console.log('Checking localStorage for exam data');
      const storedExams = localStorage.getItem('userExams');
      console.log('Raw localStorage data:', storedExams);
      
      if (storedExams) {
        const parsedExams = JSON.parse(storedExams);
        console.log('Parsed localStorage data:', parsedExams);
        
        if (parsedExams.length > 0) {
          const latestExam = parsedExams[0]; // Get the first exam (we're only storing one)
          console.log('Found exam in localStorage:', latestExam);
          
          // Update the state immediately
          setUserData({
            ...userData,
            examName: latestExam.examName,
            examDate: latestExam.examDate
          });
          
          setExamData({
            examName: latestExam.examName,
            examDate: latestExam.examDate
          });
        }
      }
      
      // Try to get user's study groups from localStorage
      const storedGroups = localStorage.getItem('myStudyGroups');
      if (storedGroups) {
        const parsedGroups = JSON.parse(storedGroups);
        console.log('Found study groups in localStorage:', parsedGroups);
        setMyStudyGroups(parsedGroups);
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
    
    // Continue with API call to get user profile
    fetchUserProfile();
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle navigating to a study group
  const handleStudyGroupClick = (subject) => {
    const routes = {
      'Physics': '/physics-group',
      'Chemistry': '/chemistry-group',
      'Biology': '/biology-group',
      'Combined Mathematics': '/combinedmaths-group'
      // Add more mappings for other subjects
    };
    
    navigate(routes[subject] || '/join-group');
  };
  
  // Function to remove a study group
  const handleRemoveStudyGroup = (groupId) => {
    // Filter out the removed group
    const updatedGroups = myStudyGroups.filter(group => group.id !== groupId);
    setMyStudyGroups(updatedGroups);
    localStorage.setItem('myStudyGroups', JSON.stringify(updatedGroups));
    
    setSuccessMessage('Study group removed from profile');
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Separate function to fetch user profile
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
        // Only update user data if no localStorage data was found
        const storedExams = localStorage.getItem('userExams');
        const hasLocalExams = storedExams && JSON.parse(storedExams).length > 0;
        
        if (hasLocalExams) {
          // Merge API data with localStorage data
          setUserData(prev => ({
            ...response.data.user,
            examName: prev.examName || response.data.user.examName,
            examDate: prev.examDate || response.data.user.examDate
          }));
        } else {
          // No local exams, just use API data
          setUserData(response.data.user);
          
          if (response.data.user.examDate) {
            setExamData({
              examName: response.data.user.examName || '',
              examDate: new Date(response.data.user.examDate).toISOString().split('T')[0]
            });
          }
        }
        setProfileData({
          firstName: response.data.user.firstName || '',
          lastName: response.data.user.lastName || '',
          university: response.data.user.university || '',
          course: response.data.user.course || ''
        });
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

  // Get user's full name
  const getFullName = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    } else if (userData.firstName) {
      return userData.firstName;
    } else if (userData.username) {
      return userData.username;
    }
    return "Sathyajith Wickramasingha"; // Default fallback
  };

  // Get user's initials for avatar
  const getInitials = () => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
    } else if (userData.firstName) {
      return userData.firstName.charAt(0);
    } else if (userData.username) {
      return userData.username.charAt(0);
    }
    return "SW"; // Default fallback
  };

  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExamSubmit = async () => {
    try {
      // Validate inputs
      if (!examData.examName.trim() || !examData.examDate) {
        setError('Please fill in all exam details');
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Save to localStorage first
      const examObj = {
        id: Date.now(),
        examName: examData.examName,
        examDate: examData.examDate
      };
      localStorage.setItem('userExams', JSON.stringify([examObj]));

      // Also try to save to API
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
          console.log('Exam updated in API successfully');
        }
      } catch (apiError) {
        console.error('API error (but continuing with localStorage):', apiError);
      }

      // Update local state regardless of API success
      setUserData(prev => ({
        ...prev,
        examName: examData.examName,
        examDate: examData.examDate
      }));
      
      setSuccessMessage('Exam details updated successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating exam details:', error);
      setError('Failed to update exam details. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleRemoveExam = () => {
    try {
      // Remove from localStorage
      localStorage.removeItem('userExams');
      
      // Try to remove from API too
      try {
        axios.delete('/api/auth/remove-exam', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {}
        });
      } catch (apiError) {
        console.error('API removal error (but continuing):', apiError);
      }

      // Update local state regardless of API success
      setUserData(prev => ({
        ...prev,
        examName: '',
        examDate: null
      }));
      
      setExamData({
        examName: '',
        examDate: ''
      });
      
      setSuccessMessage('Exam removed successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error removing exam details:', error);
      setError('Failed to remove exam details. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate remaining time until exam
  const calculateTimeRemaining = () => {
    if (!userData.examDate) return { days: 19, hours: 6, minutes: 38, seconds: 58 };
    
    try {
      const examTime = new Date(userData.examDate).getTime();
      const now = new Date().getTime();
      const difference = examTime - now;
      
      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    } catch (error) {
      console.error('Error calculating time remaining:', error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };
  
  // Add useEffect to update the timer every second
  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeRemaining());
    
    // Set up interval to update every second
    const timerInterval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    
    // Clean up on component unmount
    return () => clearInterval(timerInterval);
  }, [userData.examDate]); // Recalculate when exam date changes

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async () => {
    try {
      // Validate inputs
      if (!profileData.firstName.trim() || !profileData.lastName.trim() || 
          !profileData.university.trim() || !profileData.course.trim()) {
        setError('Please fill in all profile details');
        setTimeout(() => setError(null), 3000);
        return;
      }

      console.log('Sending profile update request with data:', profileData);
      console.log('Using token:', token);

      const response = await axios.put(
        '/api/users/profile',
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Profile update response:', response.data);

      if (response.data.success) {
        setUserData(response.data.user);
        setSuccessMessage('Profile updated successfully!');
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } else {
        setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (deleteConfirmation !== 'DELETE') {
        setError('Please type DELETE to confirm account deletion');
        setTimeout(() => setError(null), 3000);
        return;
      }

      const response = await axios.delete('/api/users/account', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage('Account deleted successfully');
        setShowSuccessMessage(true);
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.response?.data?.message || 'Failed to delete account. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  // Check if we have exam data to display
  const hasExamData = userData.examName || userData.examDate;
  
  // For debugging - show what we have in state
  console.log('Current userData state:', userData);
  console.log('Current examData state:', examData);
  console.log('hasExamData:', hasExamData);

  const DeleteAccountModal = () => (
    <div className="delete-account-modal" onClick={(e) => {
      e.stopPropagation();
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    }}>
      <div className="delete-account-content" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Account</h3>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <p>Type <strong>DELETE</strong> to confirm:</p>
        <input
          type="text"
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          placeholder="Type DELETE to confirm"
          autoFocus
        />
        <div className="delete-account-buttons">
          <button 
            className="cancel-button"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmation('');
            }}
          >
            Cancel
          </button>
          <button 
            className="delete-button"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmation !== 'DELETE'}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page-container">
      {showSuccessMessage && (
        <div className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 1050 }}>
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-4" style={{ zIndex: 1050 }}>
          {error}
        </div>
      )}
      
      <div className="profile-layout">
        {/* Left column - Profile */}
        <div className="profile-left-column">
          <div className="profile-user-info">
            <div className="profile-avatar-container">
              {userData.profilePicture ? (
                <img 
                  src={userData.profilePicture} 
                  alt={getFullName()} 
                  className="profile-avatar" 
                />
              ) : (
                <div className="profile-avatar profile-avatar-initials">
                  {getInitials()}
                </div>
              )}
            </div>
            <h3 className="profile-username">{getFullName()}</h3>
            <p className="profile-email">{userData.email || "user@example.com"}</p>
            <p className="profile-university">{userData.university || "University not set"}</p>
            <p className="profile-course">{userData.course || "Course not set"}</p>
            
            <div className="countdown-container">
              <h4 className="countdown-title">Time Until {userData.examName || "Advanced Level"}</h4>
              <div className="countdown-timer">
                <div className="countdown-block">
                  <div className="countdown-value">{timeLeft.days}</div>
                  <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-block">
                  <div className="countdown-value">{timeLeft.hours}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-block">
                  <div className="countdown-value">{timeLeft.minutes}</div>
                  <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-block">
                  <div className="countdown-value">{timeLeft.seconds}</div>
                  <div className="countdown-label">Seconds</div>
                </div>
              </div>
            </div>
            
            {/* Exam Details Section */}
            {isEditing ? (
              <div className="exam-edit-form">
                <h4>Edit Exam Details</h4>
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
            ) : (
              <div className="exam-details-box">
                <h4 className="exam-details-title">Exam Details</h4>
                {hasExamData ? (
                  <>
                    <div className="exam-details-content">
                      <div className="exam-detail-row">
                        <span className="exam-detail-label">Exam :</span>
                        <span className="exam-detail-value">{userData.examName || "Advanced level exam"}</span>
                      </div>
                      <div className="exam-detail-row">
                        <span className="exam-detail-label">Exam Date:</span>
                        <span className="exam-detail-value">
                          {userData.examDate ? new Date(userData.examDate).toLocaleDateString() : "2025/03/12"}
                        </span>
                      </div>
                    </div>
                    <div className="exam-actions-row">
                      <button className="exam-edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                      <button className="exam-remove-btn" onClick={handleRemoveExam}>Remove</button>
                    </div>
                  </>
                ) : (
                  <div className="no-exam-data">
                    <p>No exam details set yet.</p>
                    <button className="exam-edit-btn" onClick={() => setIsEditing(true)}>Add Exam Details</button>
                  </div>
                )}
              </div>
            )}
            
            {/* Logout button */}
            <div className="logout-container">
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
          
          <div className="profile-actions">
            <button 
              className="edit-profile-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <button 
              className="delete-account-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrashAlt /> Delete Account
            </button>
          </div>
        </div>

        {/* Right column - Study Groups */}
        <div className="profile-right-column">
          {/* MOVED: My Study Groups Section - now at the top of right column */}
          <div className="my-study-groups-box">
            <h4 className="study-groups-title">
              <FaUserFriends style={{marginRight: '8px'}} /> 
              My Study Groups
            </h4>
            
            {myStudyGroups.length > 0 ? (
              <div className="study-groups-list">
                {myStudyGroups.map(group => (
                  <div key={group.id} className="study-group-item">
                    <div>
                      <div>Advanced Level</div>
                      <div>{group.subject}</div>
                    </div>
                    <div>
                      <button 
                        className="enter-group-btn" 
                        onClick={() => handleStudyGroupClick(group.subject)}
                      >
                        Enter
                      </button>
                      <button 
                        className="remove-group-btn" 
                        onClick={() => handleRemoveStudyGroup(group.id)}
                        aria-label="Remove group"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-groups-message">
                <p>You haven't added any study groups yet.</p>
                <button 
                  className="browse-groups-btn"
                  onClick={() => navigate('/join-group')}
                >
                  Browse Study Groups
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="profile-edit-form">
              <h3>Edit Profile</h3>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>University</label>
                <input
                  type="text"
                  name="university"
                  value={profileData.university}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  value={profileData.course}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="button-group">
                <button onClick={handleProfileSubmit} className="save-button">Save Changes</button>
                <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h3>Profile Information</h3>
              <p><strong>Name:</strong> {getFullName()}</p>
              <p><strong>University:</strong> {userData.university}</p>
              <p><strong>Course:</strong> {userData.course}</p>
            </div>
          )}
        </div>
      </div>
      
      {showDeleteModal && <DeleteAccountModal />}
    </div>
  );
};

export default Profile;
