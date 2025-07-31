
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Import routes
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Social Content Masterclass Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      effects: '/api/effects',
      scenarios: '/api/scenarios',
      generate: '/api/generate'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Social Content Masterclass Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🎨 Effects API: http://0.0.0.0:${PORT}/api/effects`);
  console.log(`🎬 Scenarios API: http://0.0.0.0:${PORT}/api/scenarios`);
  console.log(`⚡ Generate API: http://0.0.0.0:${PORT}/api/generate`);
  console.log(`🌍 Root endpoint: http://0.0.0.0:${PORT}/`);
});
