import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => {
  const [click, setClick] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [activeContentTab, setActiveContentTab] = useState('feedback');

  const handleClick = () => {
    setClick(!click);
  };

  const closeMobileMenu = () => {
    setClick(false);
  };

  const isLoggedIn = true;
  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Study Buddy <i className="fas fa-graduation-cap"></i>
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/join-group" className="nav-links" onClick={closeMobileMenu}>
              Join Group
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-links" onClick={closeMobileMenu}>
              Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin" className="nav-links" onClick={closeMobileMenu}>
              Admin Panel
            </Link>
          </li>
          {isLoggedIn ? (
            <li className="nav-item">
              <button className="nav-links-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links-button" onClick={closeMobileMenu}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default AdminNav; 