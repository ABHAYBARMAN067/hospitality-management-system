const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper functions for image upload
const uploadImage = async (filePath, options = {}) => {
  try {

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'hospitality-management',
      ...options,
    });
    return result;
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed: ' + error.message);
  }
};

const getImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    ...transformations,
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getImageUrl,
};
