import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Make login request
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data.success) {
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Show success message
        setShowSuccessPopup(true);
        setShowErrorPopup(false);
        
        // Call login from auth context
        await login(response.data.user, response.data.token);
        
        // Redirect after short delay
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate(redirectPath);
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'An error occurred during login';
      setErrorMessage(message);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p className="login-subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
              />
            </div>
            {errors.password && (
              <div className="error-message">
                <FaExclamationCircle /> {errors.password}
              </div>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="register-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup success">
          <FaCheckCircle /> Login successful! Redirecting...
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="popup error">
          <FaExclamationCircle /> {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
