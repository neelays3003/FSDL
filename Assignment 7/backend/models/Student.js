const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  prn: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', default: null }
});

module.exports = mongoose.model('Student', studentSchema);