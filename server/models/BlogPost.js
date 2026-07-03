const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: { type: String, required: true },
  author: { type: String, default: 'Mary Liberty' },
  category: String,
  tags: [String],
  publishedDate: { type: Date, default: Date.now },
  readingTime: { type: Number, default: 5 },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  metaTitle: String,
  metaDescription: String,
}, { timestamps: true });

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ published: 1, publishedDate: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
