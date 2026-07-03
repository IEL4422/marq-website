const express = require('express');
const EducationalGuide = require('../models/EducationalGuide');
const { staffMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const guides = await EducationalGuide.find({ published: true }).sort({ orderIndex: 1 });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const guide = await EducationalGuide.findOne({ slug: req.params.slug, published: true });
    if (!guide) return res.status(404).json({ error: 'Guide not found' });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', staffMiddleware, async (req, res) => {
  try {
    const guide = await EducationalGuide.create(req.body);
    res.status(201).json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', staffMiddleware, async (req, res) => {
  try {
    const guide = await EducationalGuide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
