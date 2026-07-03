const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  content: { type: String, required: true },
  topics: [String],
  metaTitle: String,
  metaDescription: String,
  readingTime: { type: Number, default: 5 },
  orderIndex: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('EducationalGuide', guideSchema);
