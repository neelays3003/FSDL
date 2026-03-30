const express = require('express');
const router = express.Router();
const { destinations, packages, testimonials, bookings, stats } = require('../data/db');

// HOME
router.get('/', (req, res) => {
  const featuredDestinations = destinations.slice(0, 4);
  const featuredPackages = packages.slice(0, 4);
  res.render('home', {
    title: 'Wanderlust — Luxury Travel Curated for the Discerning Explorer',
    destinations: featuredDestinations,
    packages: featuredPackages,
    testimonials,
    stats,
    activeNav: 'home'
  });
});

// DESTINATIONS
router.get('/destinations', (req, res) => {
  const { continent, search } = req.query;
  let filtered = [...destinations];
  if (continent && continent !== 'all') {
    filtered = filtered.filter(d => d.continent.toLowerCase() === continent.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.continent.toLowerCase().includes(q)
    );
  }
  const continents = [...new Set(destinations.map(d => d.continent))];
  res.render('destinations', {
    title: 'Destinations — Wanderlust',
    destinations: filtered,
    continents,
    selectedContinent: continent || 'all',
    searchQuery: search || '',
    activeNav: 'destinations'
  });
});

// DESTINATION DETAIL
router.get('/destinations/:id', (req, res) => {
  const dest = destinations.find(d => d._id === req.params.id);
  if (!dest) return res.status(404).render('404', { title: 'Not Found — Wanderlust' });
  const relatedPackages = packages.filter(p => p.destinationId === dest._id);
  res.render('destination-detail', {
    title: `${dest.name} — Wanderlust`,
    dest,
    relatedPackages,
    activeNav: 'destinations'
  });
});

// PACKAGES
router.get('/packages', (req, res) => {
  const { type } = req.query;
  let filtered = [...packages];
  if (type && type !== 'all') {
    filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
  }
  const types = [...new Set(packages.map(p => p.type))];
  res.render('packages', {
    title: 'Travel Packages — Wanderlust',
    packages: filtered,
    types,
    selectedType: type || 'all',
    activeNav: 'packages'
  });
});

// ABOUT
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us — Wanderlust',
    stats,
    activeNav: 'about'
  });
});

// CONTACT
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact — Wanderlust',
    activeNav: 'contact'
  });
});

// BOOK (GET) - show booking form
router.get('/book', (req, res) => {
  const { packageId } = req.query;
  const selectedPackage = packageId ? packages.find(p => p._id === packageId) : null;
  res.render('book', {
    title: 'Book Your Journey — Wanderlust',
    packages,
    selectedPackage,
    activeNav: ''
  });
});

// BOOK (POST) - submit booking
router.post('/book', (req, res) => {
  const { name, email, phone, packageId, travelers, date, notes } = req.body;
  const pkg = packages.find(p => p._id === packageId);
  const booking = {
    _id: 'b' + Date.now(),
    name, email, phone,
    packageId,
    packageName: pkg ? pkg.name : packageId,
    destination: pkg ? pkg.destination : '',
    travelers: parseInt(travelers) || 1,
    date,
    notes,
    totalPrice: pkg ? pkg.price * (parseInt(travelers) || 1) : 0,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  res.render('booking-confirmation', {
    title: 'Booking Confirmed — Wanderlust',
    booking,
    activeNav: ''
  });
});

// CONTACT POST
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  // In a real app, save to DB or send email
  res.render('contact-success', {
    title: 'Message Sent — Wanderlust',
    name,
    activeNav: 'contact'
  });
});

// API: Get all destinations (JSON API endpoint)
router.get('/api/destinations', (req, res) => {
  res.json({ success: true, count: destinations.length, data: destinations });
});

// API: Get all packages (JSON API endpoint)
router.get('/api/packages', (req, res) => {
  res.json({ success: true, count: packages.length, data: packages });
});

// API: Get bookings (JSON API endpoint)
router.get('/api/bookings', (req, res) => {
  res.json({ success: true, count: bookings.length, data: bookings });
});

module.exports = router;
