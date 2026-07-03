const express = require('express');
const ClientAgreement = require('../models/ClientAgreement');
const { staffMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { clientName, clientEmail, packageName, packagePrice, signatureType, signatureData } = req.body;
    if (!clientName || !clientEmail || !packageName || !signatureType || !signatureData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const agreement = await ClientAgreement.create({ ...req.body, ipAddress: req.ip });
    res.status(201).json({ success: true, id: agreement._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', staffMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const agreements = await ClientAgreement.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await ClientAgreement.countDocuments();
    res.json({ agreements, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
