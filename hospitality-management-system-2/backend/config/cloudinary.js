const cloudinary = require('cloudinary').v2;

// Validate Cloudinary configuration before setting up
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary configuration missing. Please check your .env file.');
  console.error('Required environment variables:');
  console.error('  - CLOUDINARY_CLOUD_NAME');
  console.error('  - CLOUDINARY_API_KEY');
  console.error('  - CLOUDINARY_API_SECRET');
  console.error('Image uploads will fail until these are configured.');
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  console.log('✅ Cloudinary connected successfully');
}

// Export both the cloudinary instance and configuration status
module.exports = cloudinary;
module.exports.isConfigured = !!(cloudName && apiKey && apiSecret);
