const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/database');
const securityMiddleware = require('./middlewares/security');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middlewares/rateLimiter');
const { handleUploadError } = require('./middlewares/fileUpload');
const cache = require('./helpers/cache');
const specs = require('./config/swagger');

const app = express();

// Security middleware
app.use(securityMiddleware);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Note: Removed global multer middleware to avoid conflicts with specific upload middlewares
// Each route that needs file upload will use its own specific middleware

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/upload/', uploadLimiter);

// MongoDB Connection
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Routes with caching where appropriate
app.use('/api/auth', require('./controllers/authController'));
app.use('/api/users', require('./controllers/userController'));

// Restaurant routes with optional caching
const restaurantController = require('./controllers/restaurantController');
const restaurantCacheMiddleware = cache.middleware ? cache.middleware((req) => `restaurants:${JSON.stringify(req.query)}`) : (req, res, next) => next();
app.use('/api/restaurants', restaurantCacheMiddleware, restaurantController);

app.use('/api/bookings', require('./controllers/bookingController'));
app.use('/api/orders', require('./controllers/orderController'));
app.use('/api/admin', require('./controllers/adminController'));
app.use('/api/menu', require('./controllers/menuController'));
app.use('/api/ratings', require('./controllers/reviewController'));
app.use('/api/reports', require('./controllers/reportsController'));

// File upload error handling
app.use('/api/upload', handleUploadError);

// Cache management endpoints (for admin use)
app.post('/api/cache/clear', (req, res) => {
  if (cache.clearPattern) {
    cache.clearPattern('*')
      .then(() => res.json({ message: 'Cache cleared successfully' }))
      .catch(err => res.status(500).json({ error: 'Failed to clear cache' }));
  } else {
    res.status(503).json({ error: 'Cache service not available' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
