const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  examName: {
    type: String
  },
  examDate: {
    type: Date
  },
  quizResults: [{
    subject: String,
    quizName: String,
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    date: Date
  }],
  recentActivity: [{
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  totalStudyHours: {
    type: Number,
    default: 0
  },
  weeklyStudyHours: {
    type: Number,
    default: 0
  },
  studyStreak: {
    type: Number,
    default: 0
  },
  todayStudyTime: {
    type: Number,
    default: 0
  },
  lastStudyDate: {
    type: Date
  }
});

module.exports = mongoose.model('User', userSchema); 