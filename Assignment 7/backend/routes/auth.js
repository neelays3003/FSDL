const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { prn, fullName, email, password } = req.body;

    // validation
    if (!prn || !fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await Student.findOne({
      $or: [{ prn }, { email }]
    });

    if (existing) {
      return res.status(400).json({
        message: 'Student already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      prn,
      fullName,
      email,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({ message: 'Registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'admin') {
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(400).json({ message: 'Invalid admin credentials' });

      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(400).json({ message: 'Invalid admin credentials' });

      const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        role: 'admin',
        user: admin
      });
    }

    const student = await Student.findOne({
      $or: [{ email }, { prn: email }]
    });

    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: 'student',
      user: student
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;