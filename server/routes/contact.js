const express = require('express');
const ContactSubmission = require('../models/ContactSubmission');
const { staffMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message are required' });

    const submission = await ContactSubmission.create({
      name, email, phone, message,
      ipAddress: req.ip
    });
    res.status(201).json({ success: true, id: submission._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', staffMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, viewed } = req.query;
    const filter = {};
    if (viewed !== undefined) filter.viewed = viewed === 'true';

    const submissions = await ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ContactSubmission.countDocuments(filter);
    res.json({ submissions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', staffMiddleware, async (req, res) => {
  try {
    const submission = await ContactSubmission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
