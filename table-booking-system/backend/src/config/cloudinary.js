const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

// Test Cloudinary configuration
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary configuration failed:', error.message);
    return false;
  }
};

// Test connection on startup
testCloudinaryConnection();

module.exports = cloudinary;
