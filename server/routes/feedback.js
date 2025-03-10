const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback'
    });
  }
});

// Alternative endpoint for getting all feedback
router.get('/all', async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback'
    });
  }
});

router.post('/submit', auth, async (req, res) => {
  try {
    const feedback = new Feedback({
      ...req.body,
      userId: req.user.id  // Add the authenticated user's ID
    });
    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
});

// Get user's feedback
router.get('/my-feedback', auth, async (req, res) => {
  try {
    console.log('Fetching feedback for user:', req.user.id); // Add logging
    
    const feedback = await Feedback.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log('Found feedback:', feedback); // Add logging

    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback'
    });
  }
});

module.exports = router;