const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { sequelize } = require("./models");
require("dotenv").config({ path: './.env' });

// Manual fallback for environment variables
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'your-super-secret-refresh-key-change-this-in-production';
}

// Debug environment variables
console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET loaded:', !!process.env.JWT_REFRESH_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'EduStack Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check
app.get('/api/health/database', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EduStack Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      database: '/api/health/database',
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Database synchronization and server startup
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Synchronize database (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database & tables synchronized successfully');

    // Seed initial data
    const seedRoles = require('./seeds/roles');
    await seedRoles();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️ Database check: http://localhost:${PORT}/api/health/database`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await sequelize.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});

// Start the server
startServer();
