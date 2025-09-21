const express = require('express');
const { body } = require('express-validator');
const {
  signup,
  login,
  getMe,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})*$/)
    .withMessage('Please provide a valid email (e.g., user@example.com)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .custom((value) => {
      // Allow empty phone numbers (optional field)
      if (!value || value.trim() === '') {
        return true;
      }
      // Validate format only if phone is provided
      const phoneRegex = /^\+?[\d\s-()]+$/;
      if (!phoneRegex.test(value)) {
        throw new Error('Please provide a valid phone number');
      }
      return true;
    }),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  // Admin specific validations
  body('hotelName')
    .if(body('role').equals('admin'))
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Hotel name must be between 2 and 100 characters'),
  body('hotelAddress')
    .if(body('role').equals('admin'))
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Hotel address must be between 5 and 200 characters'),
  body('rentPerDay')
    .if(body('role').equals('admin'))
    .isNumeric()
    .withMessage('Rent per day must be a number')
    .isFloat({ min: 0 })
    .withMessage('Rent per day must be greater than 0')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})*$/)
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .custom((value) => {
      // Allow empty phone numbers (optional field)
      if (!value || value.trim() === '') {
        return true;
      }
      // Validate format only if phone is provided
      const phoneRegex = /^\+?[\d\s-()]+$/;
      if (!phoneRegex.test(value)) {
        throw new Error('Please provide a valid phone number');
      }
      return true;
    })
];

// Public routes
// Use multer for file uploads in signup
router.post('/signup', upload.fields([
  { name: 'hotelImage', maxCount: 1 },
  { name: 'dishImage0', maxCount: 1 },
  { name: 'dishImage1', maxCount: 1 },
  { name: 'dishImage2', maxCount: 1 },
  { name: 'dishImage3', maxCount: 1 },
  { name: 'dishImage4', maxCount: 1 },
  { name: 'dishImage5', maxCount: 1 }
]), signupValidation, signup);

router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, updateProfile);

module.exports = router;
