const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_db');
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      const newAdmin = new Admin({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword
      });
      await newAdmin.save();
      console.log(`Admin seeded: ${adminEmail} / ${adminPassword}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
