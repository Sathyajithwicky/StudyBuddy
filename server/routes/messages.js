const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Messages route working' });
});

// Get messages for a group
router.get('/:groupId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ 
      groupId: req.params.groupId 
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    console.log('User from token:', req.user);
    const { content, groupId, senderName } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'User not properly authenticated',
        user: req.user 
      });
    }

    if (!content || !groupId || !senderName) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { content, groupId, senderName }
      });
    }

    const newMessage = new Message({
      sender: req.user.id,
      content,
      groupId,
      senderName
    });

    console.log('Attempting to save message:', newMessage);

    const savedMessage = await newMessage.save();
    console.log('Message saved successfully:', savedMessage);

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      message: 'Error sending message',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 