const express = require('express');
const Feedback = require('../models/Feedback');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Submit feedback
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit feedback' });
    }

    const { faculty, subject, ratings, comment } = req.body;
    
    const newFeedback = new Feedback({
      student: req.user.id,
      faculty,
      subject,
      ratings,
      comment
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already submitted feedback for this faculty and subject.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Admin get all feedback OR student get their own feedback
router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const feedbacks = await Feedback.find()
        .populate('student', 'fullName prn')
        .populate('faculty', 'name')
        .populate('subject', 'name')
        .sort({ createdAt: -1 });
      return res.json(feedbacks);
    } else {
      const feedbacks = await Feedback.find({ student: req.user.id })
        .populate('faculty', 'name')
        .populate('subject', 'name')
        .sort({ createdAt: -1 });
      return res.json(feedbacks);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
