require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  // MongoDB Atlas connection string (recommended for production)
  // Get this from MongoDB Atlas dashboard: https://cloud.mongodb.com
  // Format: mongodb+srv://username:password@cluster.mongodb.net/database_name
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hospitality_management',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

module.exports = config;
