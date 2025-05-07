const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-photos/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Ensure uploads directory exists
const fs = require('fs');
const uploadDir = 'uploads/profile-photos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Register User
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, university, course } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      university,
      course
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      university: user.university,
      course: user.course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, university, course, examDate } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (university) user.university = university;
    if (course) user.course = course;
    if (examDate) user.examDate = examDate;

    // Add profile update activity
    const activity = {
      type: 'profile',
      description: 'Updated profile information',
      timestamp: new Date()
    };

    // Initialize recentActivity array if it doesn't exist
    if (!user.recentActivity) {
      user.recentActivity = [];
    }

    // Add new activity and keep only last 10
    user.recentActivity.unshift(activity);
    user.recentActivity = user.recentActivity.slice(0, 10);

    await user.save();

    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        course: user.course,
        examDate: user.examDate,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/users/profile-photo
// @desc    Upload profile photo
// @access  Private
router.put('/profile-photo', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture) {
      const oldPhotoPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update user's profile picture path
    const profilePicturePath = '/uploads/profile-photos/' + req.file.filename;
    user.profilePicture = profilePicturePath;

    // Add profile photo update activity
    const activity = {
      type: 'profile',
      description: 'Updated profile photo',
      timestamp: new Date()
    };

    // Initialize recentActivity array if it doesn't exist
    if (!user.recentActivity) {
      user.recentActivity = [];
    }

    // Add new activity and keep only last 10
    user.recentActivity.unshift(activity);
    user.recentActivity = user.recentActivity.slice(0, 10);

    await user.save();

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      profilePicture: profilePicturePath
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading profile photo'
    });
  }
});

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        course: user.course,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        examName: user.examName,
        examDate: user.examDate,
        status: user.status || 'active'
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT api/users/:id
// @desc    Update user by ID (Admin only)
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, university, course } = req.body;
    const userId = req.params.id;

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (university) user.university = university;
    if (course) user.course = course;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        course: user.course,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user by ID (Admin only)
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT api/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private (Admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be either "active" or "inactive"'
      });
    }

    // Find user and update status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        university: user.university,
        course: user.course,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's study progress
    const studyProgress = {
      totalHours: user.totalStudyHours || 0,
      weeklyHours: user.weeklyStudyHours || 0,
      streak: user.studyStreak || 0
    };

    // Get user's quiz results
    const quizResults = user.quizResults || [];

    // Get user's recent activity
    const recentActivity = user.recentActivity || [];

    // Get exam countdown if exam date exists
    const examCountdown = user.examDate ? {
      examName: user.examName,
      examDate: user.examDate
    } : null;

    res.json({
      success: true,
      dashboard: {
        studyProgress,
        quizResults,
        recentActivity,
        examCountdown
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @route   POST api/users/quiz-results
// @desc    Save user's quiz results
// @access  Private
router.post('/quiz-results', auth, async (req, res) => {
  try {
    console.log('Received quiz results request. Body:', req.body);
    console.log('User from token:', req.user);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Found user:', {
      id: user._id,
      email: user.email,
      currentQuizResults: user.quizResults?.length || 0
    });

    const { subject, quizName, score, totalQuestions, correctAnswers, date } = req.body;

    // Validate required fields
    if (!subject || !quizName || score == null || !totalQuestions || correctAnswers == null) {
      console.error('Missing required fields:', {
        subject,
        quizName,
        score,
        totalQuestions,
        correctAnswers
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Add the new quiz result
    const quizResult = {
      subject,
      quizName,
      score,
      totalQuestions,
      correctAnswers,
      date: date || new Date()
    };

    console.log('Creating new quiz result:', quizResult);

    // Initialize arrays if they don't exist
    if (!Array.isArray(user.quizResults)) {
      console.log('Initializing quizResults array');
      user.quizResults = [];
    }
    if (!Array.isArray(user.recentActivity)) {
      console.log('Initializing recentActivity array');
      user.recentActivity = [];
    }

    // Add to the beginning of the array to show most recent first
    user.quizResults.unshift(quizResult);
    console.log('Added quiz result. New length:', user.quizResults.length);

    // Keep only the last 10 quiz results
    if (user.quizResults.length > 10) {
      user.quizResults = user.quizResults.slice(0, 10);
      console.log('Trimmed quiz results to 10');
    }

    // Add to recent activity
    const activityEntry = {
      type: 'quiz',
      description: `Completed ${quizName} with score ${score}%`,
      timestamp: date || new Date()
    };
    user.recentActivity.unshift(activityEntry);
    console.log('Added activity entry:', activityEntry);

    // Keep only the last 10 activities
    if (user.recentActivity.length > 10) {
      user.recentActivity = user.recentActivity.slice(0, 10);
      console.log('Trimmed recent activity to 10');
    }

    console.log('Saving user with updated data...');
    await user.save();
    console.log('User saved successfully');

    res.json({
      success: true,
      message: 'Quiz results saved successfully',
      quizResults: user.quizResults,
      recentActivity: user.recentActivity
    });
  } catch (error) {
    console.error('Error in quiz results route:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Error saving quiz results',
      error: error.message
    });
  }
});

// @route   POST api/users/study-progress
// @desc    Update user's study progress
// @access  Private
router.post('/study-progress', auth, async (req, res) => {
  try {
    const { studyDuration } = req.body; // Duration in minutes
    const MINIMUM_DAILY_MINUTES = 60; // Minimum minutes required for streak (1 hour)

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Convert minutes to hours
    const hoursStudied = studyDuration / 60;

    // Update total study hours
    user.totalStudyHours = (user.totalStudyHours || 0) + hoursStudied;

    // Update weekly study hours
    user.weeklyStudyHours = (user.weeklyStudyHours || 0) + hoursStudied;

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initialize today's study time if not exists
    if (!user.todayStudyTime) {
      user.todayStudyTime = 0;
    }

    // Check if it's a new day
    const lastStudyDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    if (lastStudyDate) {
      lastStudyDate.setHours(0, 0, 0, 0);
    }

    if (!lastStudyDate || lastStudyDate.getTime() < today.getTime()) {
      // It's a new day
      user.todayStudyTime = studyDuration;

      // Check if the last study was yesterday and met minimum time
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (!lastStudyDate || (lastStudyDate.getTime() === yesterday.getTime() && user.todayStudyTime >= MINIMUM_DAILY_MINUTES)) {
        // Either this is the first study session ever, or they studied enough yesterday
        user.studyStreak = (user.studyStreak || 0) + 1;
      } else {
        // They missed a day or didn't study enough, reset streak to 1
        user.studyStreak = 1;
      }
    } else {
      // Same day, add to today's time
      user.todayStudyTime += studyDuration;
    }

    // Update last study date
    user.lastStudyDate = new Date();

    await user.save();

    // Calculate minutes needed for today's streak
    const minutesNeededForStreak = Math.max(0, MINIMUM_DAILY_MINUTES - user.todayStudyTime);

    res.json({
      success: true,
      message: 'Study progress updated successfully',
      studyProgress: {
        totalHours: user.totalStudyHours,
        weeklyHours: user.weeklyStudyHours,
        streak: user.studyStreak,
        todayMinutes: user.todayStudyTime,
        minutesNeededForStreak
      }
    });
  } catch (error) {
    console.error('Error updating study progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating study progress',
      error: error.message
    });
  }
});

module.exports = router; 