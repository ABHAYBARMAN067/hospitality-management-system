// cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

// Validate required environment variables
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
}

// Configure Cloudinary with validation
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
    return true;
  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
    return false;
  }
};

// Helper function to validate and upload image
export const uploadImage = async (file, folder = 'restaurant-tables') => {
  try {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    // Validate file type
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedFormats.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, JPG, and WebP files are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'auto',
      timeout: 60000,
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error('Image upload failed:', error.message);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Initialize connection test
testCloudinaryConnection();

export default cloudinary;
