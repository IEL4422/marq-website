const express = require('express');
const router = express.Router();

router.post('/zapier', async (req, res) => {
  const { eventType, data } = req.body;
  const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;

  if (zapierUrl) {
    try {
      const resp = await fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, data, timestamp: new Date().toISOString() }),
      });
      if (!resp.ok) console.error('Zapier webhook failed:', resp.status);
    } catch (err) {
      console.error('Zapier webhook error:', err.message);
    }
  }

  res.json({ received: true });
});

router.post('/analytics', async (req, res) => {
  res.json({ received: true });
});

module.exports = router;
