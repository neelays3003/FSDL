const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  ratings: {
    quality: { type: Number, required: true, min: 1, max: 5 },
    clarity: { type: Number, required: true, min: 1, max: 5 },
    interaction: { type: Number, required: true, min: 1, max: 5 },
    overall: { type: Number, required: true, min: 1, max: 5 }
  },
  comment: { type: String }
}, { timestamps: true });

// Prevent duplicate feedback submissions per student per subject
feedbackSchema.index({ student: 1, subject: 1, faculty: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
