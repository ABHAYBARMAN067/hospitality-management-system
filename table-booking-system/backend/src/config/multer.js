const multer = require('multer');
const path = require('path');

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter - Accept any file type for flexibility
const fileFilter = (req, file, cb) => {
  // Accept images and common file types
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif|bmp|svg|pdf|doc|docx|txt/;
  const allowedMimes = /image\/|application\/|text\//;

  if (allowedTypes.test(path.extname(file.originalname).toLowerCase()) ||
      allowedMimes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed!'), false);
  }
};

// Multer configuration with improved limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased from 5MB)
    files: 10 // Allow up to 10 files
  },
  fileFilter: fileFilter
});

module.exports = upload;
