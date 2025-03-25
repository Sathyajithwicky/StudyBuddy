const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Test route to verify router is mounted
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create token with consistent structure
    const token = jwt.sign(
      { 
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// Add password strength validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) return 'Password must be at least 8 characters long';
  if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
  if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
  if (!hasNumbers) return 'Password must contain at least one number';
  if (!hasSpecialChar) return 'Password must contain at least one special character';

  return null;
};

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, university, course } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      university,
      course
    });

    await user.save();

    // Create token with consistent structure
    const token = jwt.sign(
      { 
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        course: user.course
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Profile route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        course: user.course,
        university: user.university,
        createdAt: user.createdAt,
        examName: user.examName,
        examDate: user.examDate
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Update the exam update route
router.put('/update-exam-date', verifyToken, async (req, res) => {
  try {
    const { examName, examDate } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { examName, examDate },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Exam details updated successfully',
      examDetails: {
        examName: user.examName,
        examDate: user.examDate
      }
    });
  } catch (error) {
    console.error('Error updating exam details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating exam details'
    });
  }
});

// Add this new route
router.put('/remove-exam', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        $unset: { 
          examName: "", 
          examDate: "" 
        } 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Exam details removed successfully'
    });
  } catch (error) {
    console.error('Error removing exam details:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing exam details'
    });
  }
});

module.exports = router; 