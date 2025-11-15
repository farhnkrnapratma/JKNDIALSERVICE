const express = require('express');
const router = express.Router();
const ussdRoutes = require('./ussdRoutes');
const prisma = require('../config/db');

// Mount routes
router.use('/api', ussdRoutes);

// Enhanced Health check with database connectivity
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      service: 'JKN USSD Backend',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      service: 'JKN USSD Backend',
      error: error.message
    });
  }
});

module.exports = router;
