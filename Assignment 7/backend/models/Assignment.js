const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
}, { timestamps: true });

// Prevent duplicate assignment of the same faculty and subject in the same division
assignmentSchema.index({ division: 1, faculty: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
