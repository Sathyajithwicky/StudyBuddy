const FAQ = require('../models/FAQ.js');
const express = require('express');


const router = express.Router();

// 📌 Create a new FAQ (Anyone can ask a question)
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const faq = new FAQ({
      question,
      status: 'pending', // Default status: pending approval
    });

    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get all FAQs (Both unanswered & answered)
router.get('/get', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
