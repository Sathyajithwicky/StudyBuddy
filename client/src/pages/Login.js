import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the redirect path from state or default to home
  const redirectPath = location.state?.from || '/';

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login with:', formData);
      
      const response = await axios.post('/api/auth/login', formData);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        setShowSuccessPopup(true);
        setShowErrorPopup(false);
        
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error.response || error);
      setErrorMessage(
        error.response?.data?.message || 
        'An error occurred during login. Please try again.'
      );
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <div className="success-icon">✓</div>
            <h3>Login Successful!</h3>
            <p>Welcome back!</p>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div className="error-popup">
          <div className="error-popup-content">
            <div className="error-icon">✕</div>
            <h3>Login Failed</h3>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      <div className="login-form-container">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;