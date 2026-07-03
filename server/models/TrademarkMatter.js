const mongoose = require('mongoose');

const matterSchema = new mongoose.Schema({
  docketNumber: { type: String, unique: true },
  clientEmail: { type: String, required: true, lowercase: true },
  clientName: { type: String, required: true },
  trademarkName: { type: String, required: true },
  stage: {
    type: String,
    enum: ['intake', 'search', 'preparation', 'filed', 'examining', 'published', 'registered', 'abandoned'],
    default: 'intake'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  packageName: String,
  filingDate: Date,
  registrationNumber: String,
  goodsServices: String,
  internationalClasses: [Number],
  todos: [{
    title: String,
    dueDate: Date,
    completed: Boolean,
    reminded48h: Boolean,
    reminded24h: Boolean,
  }],
  files: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  intakeResponses: mongoose.Schema.Types.Mixed,
  notes: String,
}, { timestamps: true });

matterSchema.pre('save', async function (next) {
  if (!this.docketNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('TrademarkMatter').countDocuments();
    this.docketNumber = `MARQ-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('TrademarkMatter', matterSchema);
