const express = require('express');
const TrademarkSearchRequest = require('../models/TrademarkSearchRequest');
const { staffMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { trademarkName, clientEmail, clientName, clientPhone, businessDescription, goodsServices } = req.body;
    if (!trademarkName || !clientEmail) return res.status(400).json({ error: 'trademarkName and clientEmail required' });

    const request = await TrademarkSearchRequest.create({
      trademarkName, clientEmail, clientName, clientPhone, businessDescription, goodsServices
    });
    res.status(201).json({ success: true, id: request._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', staffMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const requests = await TrademarkSearchRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await TrademarkSearchRequest.countDocuments(filter);
    res.json({ requests, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', staffMiddleware, async (req, res) => {
  try {
    const req_ = await TrademarkSearchRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(req_);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
