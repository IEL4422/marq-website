const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true, lowercase: true },
  clientCompany: String,
  packageName: { type: String, required: true },
  packagePrice: { type: String, required: true },
  signatureType: { type: String, enum: ['drawn', 'typed'], required: true },
  signatureData: { type: String, required: true },
  signedDate: { type: Date, default: Date.now },
  ipAddress: String,
  addOns: [String],
  totalAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model('ClientAgreement', agreementSchema);
