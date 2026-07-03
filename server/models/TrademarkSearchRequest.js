const mongoose = require('mongoose');

const searchRequestSchema = new mongoose.Schema({
  trademarkName: { type: String, required: true },
  businessDescription: String,
  logoUrl: String,
  clientEmail: { type: String, required: true, lowercase: true },
  clientName: String,
  clientPhone: String,
  goodsServices: String,
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  staffNotes: String,
  results: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('TrademarkSearchRequest', searchRequestSchema);
