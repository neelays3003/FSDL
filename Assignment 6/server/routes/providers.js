const router = require('express').Router();
const Provider = require('../models/Provider');
const Appointment = require('../models/Appointment');

// Get all providers
router.get('/', async (req, res) => {
  try {
    const { serviceId } = req.query;
    const query = { isActive: true };
    if (serviceId) query.services = serviceId;
    const providers = await Provider.find(query).populate('services');
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate('services');
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get available slots for a provider on a date
router.get('/:id/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = provider.availability.find(a => a.day === dayName);
    if (!dayAvailability) return res.json({ slots: [] });

    // Get booked slots for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      provider: req.params.id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] }
    });

    const bookedSlots = bookedAppointments.map(a => a.timeSlot);
    const availableSlots = dayAvailability.slots.filter(s => !bookedSlots.includes(s));

    res.json({ slots: availableSlots, bookedSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
