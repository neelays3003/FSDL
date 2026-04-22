const express = require('express');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const { authMiddleware, studentMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, studentMiddleware);

// Get student's assigned subjects and faculties based on division
router.get('/assignments', async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId);

    if (!student.division) {
      return res.status(400).json({ message: 'You are not assigned to a division yet. Contact admin.' });
    }

    const assignments = await Assignment.find({ division: student.division })
      .populate('faculty')
      .populate('subject');

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
