import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/studybuddylogo.png';
import { useAuth } from '../context/AuthContext';
import defaultProfile from '../assets/default-profile.png';
import { FaComments } from 'react-icons/fa';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Hide navbar on Pomodoro page
  if (location.pathname === '/pomodoro') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="home_image.jpg" />
        </Link>
      </div>

      <div className="nav-right">
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
        
        <div className="auth-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <span className="separator">|</span>
              <Link to="/register" className="nav-link">Sign Up</Link>
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
              <Link 
                to="/reviews" 
                className="review-button"
                title="View my feedback"
              >
                <FaComments /> Reviews
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar; 