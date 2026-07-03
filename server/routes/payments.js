const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const { staffMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', clientEmail, clientName, packageName, metadata } = req.body;
    if (!amount || !clientEmail) return res.status(400).json({ error: 'Amount and clientEmail required' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { clientEmail, clientName, packageName, ...metadata }
    });

    await Payment.create({
      stripePaymentIntentId: paymentIntent.id,
      clientEmail,
      clientName,
      amountCents: amount,
      currency,
      packageName,
      metadata,
      status: 'pending'
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: pi.id },
      { status: 'succeeded' }
    );
  }

  res.json({ received: true });
});

router.get('/', staffMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Payment.countDocuments(filter);
    res.json({ payments, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
