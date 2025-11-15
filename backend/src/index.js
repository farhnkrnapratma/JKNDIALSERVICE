/**
 * JKN DIAL SERVICE SIMULATOR - Backend Server
 * 
 * Copyright (c) 2025 Global Palvion. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This source code is the proprietary and confidential information of
 * Global Palvion. Unauthorized copying, distribution, modification, or
 * use of this software, via any medium, is strictly prohibited without
 * the express written permission of Global Palvion.
 * 
 * For licensing inquiries: zainahmadfahrezi@gmail.com
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const dataRoutes = require('./routes/dataRoutes');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for dashboard
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:19006', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Serve static files (dashboard)
app.use(express.static(path.join(__dirname, '../public')));

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'JKN USSD API Docs'
}));

// API versioning
app.use('/api/v1', routes);

// Dashboard Data API Routes  
app.use('/api/dashboard', dataRoutes);
app.use('/api', dataRoutes); // Alias for dashboard.html compatibility

// Legacy routes (backward compatibility)
app.use('/', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'JKN USSD Simulator Backend',
    version: '1.0.0',
    status: 'Running',
    notice: 'Ini adalah prototipe simulasi USSD. USSD resmi perlu pendaftaran ke operator.',
    dashboard: '/dashboard.html',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      ussd: 'POST /api/ussd',
      test: 'GET /api/ussd/test',
      data: '/api/dashboard/*'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('JKN USSD Backend Server Started', {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
  
  console.log('\nJKN USSD Backend Server Started!');
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://0.0.0.0:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log('\nCATATAN: Ini adalah prototipe simulasi USSD via WiFi');
  console.log('USSD resmi harus didaftarkan ke operator seluler.\n');
});

module.exports = app;
