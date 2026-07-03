const express = require('express');
const ClientCase = require('../models/ClientCase');
const { authMiddleware, staffMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const cases = await ClientCase.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', staffMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const cases = await ClientCase.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await ClientCase.countDocuments(filter);
    res.json({ cases, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', staffMiddleware, async (req, res) => {
  try {
    const clientCase = await ClientCase.create(req.body);
    res.status(201).json(clientCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', staffMiddleware, async (req, res) => {
  try {
    const clientCase = await ClientCase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(clientCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const clientCase = await ClientCase.findById(req.params.id);
    if (!clientCase) return res.status(404).json({ error: 'Case not found' });

    const isStaff = req.user.isStaff;
    if (!isStaff && clientCase.clientEmail !== req.user.email) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    clientCase.messages.push({ sender: req.user.email, message, isStaff });
    await clientCase.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
