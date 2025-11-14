const express = require('express');
const router = express.Router();
const ussdRoutes = require('./ussdRoutes');

// Mount routes
router.use('/api', ussdRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'JKN USSD Backend'
  });
});

module.exports = router;
