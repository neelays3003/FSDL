const express = require('express');
const Division = require('../models/Division');
const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// ======================= DIVISIONS =======================
router.get('/divisions', async (req, res) => {
  const divisions = await Division.find();
  res.json(divisions);
});

router.post('/divisions', async (req, res) => {
  try {
    const division = new Division(req.body);
    await division.save();
    res.status(201).json(division);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/divisions/:id', async (req, res) => {
  await Division.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// ======================= SUBJECTS =======================
router.get('/subjects', async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

router.post('/subjects', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// ======================= FACULTIES =======================
router.get('/faculties', async (req, res) => {
  const faculties = await Faculty.find();
  res.json(faculties);
});

router.post('/faculties', async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/faculties/:id', async (req, res) => {
  await Faculty.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// ======================= ASSIGNMENTS =======================
router.get('/assignments', async (req, res) => {
  const assignments = await Assignment.find()
    .populate('division')
    .populate('faculty')
    .populate('subject');
  res.json(assignments);
});

router.post('/assignments', async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/assignments/:id', async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// ======================= STUDENTS =======================
router.get('/students', async (req, res) => {
  const students = await Student.find().populate('division');
  res.json(students);
});

router.put('/students/:id/division', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { division: req.body.divisionId },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
