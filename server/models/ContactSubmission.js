const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: String,
  message: { type: String, required: true },
  isSpam: { type: Boolean, default: false },
  viewed: { type: Boolean, default: false },
  contacted: { type: Boolean, default: false },
  ipAddress: String,
}, { timestamps: true });

module.exports = mongoose.model('ContactSubmission', contactSchema);
