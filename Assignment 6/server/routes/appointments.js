const router = require('express').Router();
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Book appointment
router.post('/', auth, async (req, res) => {
  try {
    const { provider, service, date, timeSlot, notes, totalPrice } = req.body;

    // Check if slot is taken
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      provider,
      date: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflict) return res.status(400).json({ message: 'This time slot is already booked' });

    const appointment = new Appointment({
      user: req.user._id,
      provider,
      service,
      date: new Date(date),
      timeSlot,
      notes,
      totalPrice,
      confirmationCode: uuidv4().slice(0, 8).toUpperCase()
    });

    await appointment.save();
    const populated = await Appointment.findById(appointment._id)
      .populate('provider', 'name specialization avatar')
      .populate('service', 'name duration price icon');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's appointments
router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('provider', 'name specialization avatar')
      .populate('service', 'name duration price icon color')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel appointment
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

    appointment.status = 'cancelled';
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id })
      .populate('provider', 'name specialization avatar')
      .populate('service', 'name duration price icon');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
