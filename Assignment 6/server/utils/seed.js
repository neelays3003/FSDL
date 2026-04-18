const Service = require('../models/Service');
const Provider = require('../models/Provider');

const generateSlots = (start = 9, end = 17, interval = 30) => {
  const slots = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += interval) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const allDays = [...weekdays, 'Saturday'];

const seedData = async () => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount > 0) return;

    console.log('🌱 Seeding demo data...');

    const services = await Service.insertMany([
      { name: 'General Consultation', description: 'Comprehensive health check and general medical advice', duration: 30, price: 500, category: 'Medical', icon: '🩺', color: '#ef4444' },
      { name: 'Dental Cleaning', description: 'Professional teeth cleaning and oral health assessment', duration: 45, price: 800, category: 'Dental', icon: '🦷', color: '#3b82f6' },
      { name: 'Physiotherapy', description: 'Rehabilitation and physical therapy sessions', duration: 60, price: 1200, category: 'Therapy', icon: '💪', color: '#10b981' },
      { name: 'Eye Checkup', description: 'Complete eye examination and vision testing', duration: 30, price: 600, category: 'Ophthalmology', icon: '👁️', color: '#8b5cf6' },
      { name: 'Dermatology', description: 'Skin consultation and treatment', duration: 30, price: 700, category: 'Dermatology', icon: '✨', color: '#f59e0b' },
      { name: 'Mental Health', description: 'Counseling and mental wellness sessions', duration: 60, price: 1500, category: 'Psychiatry', icon: '🧠', color: '#06b6d4' },
    ]);

    const availability = allDays.map(day => ({ day, slots: generateSlots() }));
    const weekAvailability = weekdays.map(day => ({ day, slots: generateSlots(10, 18) }));

    await Provider.insertMany([
      {
        name: 'Dr. Priya Sharma', specialization: 'General Physician', bio: 'MBBS, MD with 12 years of experience in family medicine.',
        avatar: 'PS', services: [services[0]._id], availability, rating: 4.8, reviewCount: 234
      },
      {
        name: 'Dr. Rahul Mehta', specialization: 'Dentist', bio: 'BDS, MDS specializing in cosmetic and preventive dentistry.',
        avatar: 'RM', services: [services[1]._id], availability: weekAvailability, rating: 4.9, reviewCount: 189
      },
      {
        name: 'Dr. Anita Verma', specialization: 'Physiotherapist', bio: 'MPT with expertise in sports injuries and post-surgical rehab.',
        avatar: 'AV', services: [services[2]._id], availability, rating: 4.7, reviewCount: 156
      },
      {
        name: 'Dr. Suresh Kumar', specialization: 'Ophthalmologist', bio: 'MS Ophthalmology with 15 years of clinical experience.',
        avatar: 'SK', services: [services[3]._id], availability: weekAvailability, rating: 4.6, reviewCount: 98
      },
      {
        name: 'Dr. Deepa Nair', specialization: 'Dermatologist', bio: 'MD Dermatology specializing in skin care and cosmetic treatments.',
        avatar: 'DN', services: [services[4]._id], availability, rating: 4.9, reviewCount: 312
      },
      {
        name: 'Dr. Amit Joshi', specialization: 'Psychiatrist', bio: 'MD Psychiatry providing compassionate mental health care.',
        avatar: 'AJ', services: [services[5]._id], availability: weekAvailability, rating: 4.8, reviewCount: 145
      },
    ]);

    console.log('✅ Demo data seeded successfully!');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = { seedData };
