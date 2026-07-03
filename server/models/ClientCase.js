const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  clientEmail: { type: String, required: true, lowercase: true },
  clientName: { type: String, required: true },
  trademarkName: { type: String, required: true },
  status: {
    type: String,
    enum: ['search', 'registration', 'uspto-processing', 'registered', 'on-hold', 'abandoned'],
    default: 'search'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  notes: String,
  estimatedCompletion: Date,
  docketNumber: String,
  filingDate: Date,
  registrationNumber: String,
  messages: [{
    sender: String,
    message: String,
    isStaff: Boolean,
    read: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

caseSchema.index({ clientEmail: 1 });

module.exports = mongoose.model('ClientCase', caseSchema);
