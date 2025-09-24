const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure multer storage for Cloudinary (only if configured)
let storage;
if (cloudinary.isConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'restaurants',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'avif'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
  });
} else {
  // Fallback to local storage if Cloudinary is not configured
  const path = require('path');
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
}

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload single image
const uploadSingle = upload.single('image');

// Upload multiple images
const uploadMultiple = upload.array('images', 5);

// Error handler
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum 5 files allowed.' });
    }
  }
  if (error.message.includes('Only image files')) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  cloudinary
};
