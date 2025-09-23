import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'backend/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for different types of uploads
export const createMulterConfig = (folder = 'products') => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = `backend/uploads/${folder}`;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Create unique filename with timestamp and random string
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const basename = path.basename(file.originalname, extension);
      cb(null, `${folder}-${basename}-${uniqueSuffix}${extension}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  };

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit per file
      files: 5 // Maximum 5 files
    },
    fileFilter
  });
};

// Pre-configured upload for products
export const uploadProductImages = createMulterConfig('products');

// Pre-configured upload for user avatars
export const uploadUserAvatars = createMulterConfig('avatars');

// Generic upload function for custom configurations
export const uploadFiles = (folder, maxFiles = 5, maxSizeMB = 5) => {
  return createMulterConfig(folder).array('files', maxFiles);
};

// Single file upload
export const uploadSingleFile = (folder) => {
  return createMulterConfig(folder).single('file');
};

// Multiple files upload with custom limits
export const uploadMultipleFiles = (folder, maxFiles = 5, maxSizeMB = 5) => {
  return createMulterConfig(folder).array('files', maxFiles);
};
