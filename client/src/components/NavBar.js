import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/studybuddylogo.png';
import { useAuth } from '../context/AuthContext';
import defaultProfile from '../assets/default-profile.png';
import { FaComments, FaUserShield, FaTimes, FaLock, FaBell } from 'react-icons/fa';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Add state for admin login modal
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [adminLoginError, setAdminLoginError] = useState('');
  
  // Add notification count state
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Log authentication status for debugging
  useEffect(() => {
    console.log("Auth status:", isAuthenticated);
  }, [isAuthenticated]);
  
  // Handle admin login form input changes
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // Check hardcoded credentials
    if (adminCredentials.username === 'qwerty' && adminCredentials.password === '123') {
      setShowAdminModal(false);
      setAdminCredentials({ username: '', password: '' });
      setAdminLoginError('');
      navigate('/admin');
    } else {
      setAdminLoginError('Invalid username or password');
    }
  };

  // Open admin login modal
  const openAdminModal = (e) => {
    e.preventDefault();
    setShowAdminModal(true);
  };

  // Hide navbar on Pomodoro page
  if (location.pathname === '/pomodoro') {
    return null;
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src={logo} alt="home_image.jpg" />
          </Link>
        </div>

        <div className="nav-right">
          <Link 
            to="/pomodoro" 
            className="nav-link"
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                navigate('/login', { state: { from: '/pomodoro' } });
              }
            }}
          >
            Pomodoro Timer
          </Link>
          <Link 
            to="/join-group" 
            className="nav-link"
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                navigate('/login', { state: { from: '/join-group' } });
              }
            }}
          >
            Study Groups
          </Link>
          <Link to="/feedback" className="nav-link">Feedback</Link>
          
          {/* Notification icon - make sure it's visible regardless of auth status for testing */}
          <Link to="/notifications" className="nav-link notification-link">
            <FaBell />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </Link>
          
          <div className="auth-links">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <span className="separator">|</span>
                <Link to="/register" className="nav-link">Sign Up</Link>
                <span className="separator">|</span>
                <a href="#" className="admin-link" onClick={openAdminModal}>
                  <FaUserShield /> Admin
                </a>
              </>
            ) : (
              <div className="profile-section">
                <Link to="/profile">
                  <img 
                    src={defaultProfile} 
                    alt="Profile" 
                    className="profile-image" 
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2><FaLock /> Admin Login</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowAdminModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAdminLogin} className="admin-login-form">
              {adminLoginError && (
                <div className="admin-login-error">
                  {adminLoginError}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="admin-username">Username</label>
                <input
                  type="text"
                  id="admin-username"
                  name="username"
                  value={adminCredentials.username}
                  onChange={handleAdminInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  type="password"
                  id="admin-password"
                  name="password"
                  value={adminCredentials.password}
                  onChange={handleAdminInputChange}
                  required
                />
              </div>
              
              <div className="admin-form-actions">
                <button type="submit" className="admin-login-btn">
                  Login
                </button>
                <button 
                  type="button" 
                  className="admin-cancel-btn"
                  onClick={() => setShowAdminModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;