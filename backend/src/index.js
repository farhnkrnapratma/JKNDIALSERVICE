const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for dashboard
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files (dashboard)
app.use(express.static(path.join(__dirname, '../public')));

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'JKN USSD API Docs'
}));

// Dashboard Data API Routes
app.use('/api/dashboard', dataRoutes);

// Routes
app.use('/', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏥 JKN USSD Simulator Backend',
    version: '1.0.0',
    status: 'Running',
    notice: '⚠️ Ini adalah prototipe simulasi USSD. USSD resmi perlu pendaftaran ke operator.',
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
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 JKN USSD Backend Server Started!');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://0.0.0.0:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log('\n⚠️  CATATAN: Ini adalah prototipe simulasi USSD via WiFi');
  console.log('   USSD resmi harus didaftarkan ke operator seluler.\n');
});

module.exports = app;
