const app = require('./app');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to MongoDB Atlas
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`

            Table Booking API Server             
                                                         
  Server running in ${process.env.NODE_ENV || 'development'} mode 
  Port: ${PORT}                                           
  Health check: http://localhost:${PORT}/health          
    API Base URL: http://localhost:${PORT}/api             
                                                          
    ║
                                                         
  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'} 

`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = server;
