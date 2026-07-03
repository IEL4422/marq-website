const express = require('express');
const TrademarkMatter = require('../models/TrademarkMatter');
const { authMiddleware, staffMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const matters = await TrademarkMatter.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(matters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', staffMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const matters = await TrademarkMatter.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await TrademarkMatter.countDocuments();
    res.json({ matters, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', staffMiddleware, async (req, res) => {
  try {
    const matter = await TrademarkMatter.create(req.body);
    res.status(201).json(matter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', staffMiddleware, async (req, res) => {
  try {
    const matter = await TrademarkMatter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(matter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/todos', staffMiddleware, async (req, res) => {
  try {
    const matter = await TrademarkMatter.findById(req.params.id);
    if (!matter) return res.status(404).json({ error: 'Matter not found' });
    matter.todos.push(req.body);
    await matter.save();
    res.json(matter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
