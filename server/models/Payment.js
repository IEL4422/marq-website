const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  stripePaymentIntentId: { type: String, required: true, unique: true },
  clientEmail: { type: String, required: true, lowercase: true },
  clientName: String,
  amountCents: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: { type: String, enum: ['pending', 'succeeded', 'failed', 'canceled'], default: 'pending' },
  packageName: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
