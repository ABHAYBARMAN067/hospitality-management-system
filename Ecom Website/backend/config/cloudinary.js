import { v2 as cloudinary } from 'cloudinary';

// Get Cloudinary environment variables (loaded by server.js)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('🔍 Checking Cloudinary environment variables...');
console.log('📝 CLOUDINARY_CLOUD_NAME:', cloudName ? '✅ Set' : '❌ Missing');
console.log('📝 CLOUDINARY_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
console.log('📝 CLOUDINARY_API_SECRET:', apiSecret ? '✅ Set' : '❌ Missing');

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary environment variables are missing. Please check your .env file.');
  console.error('📋 Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
} else {
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    console.log('✅ Cloudinary connected successfully');
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
  }
}

export const uploadToCloudinary = async (filePath, folder = 'products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};

export default cloudinary;
