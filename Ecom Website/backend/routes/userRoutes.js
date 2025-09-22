import express from 'express';
import { body, param } from 'express-validator';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  toggleUserBlock,
  getUserStats
} from '../controllers/userController.js';
import { protect, authorize, ownerOrAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isBlocked')
    .optional()
    .isBoolean()
    .withMessage('isBlocked must be a boolean')
];

const toggleBlockValidation = [
  body('isBlocked')
    .isBoolean()
    .withMessage('isBlocked must be a boolean')
];

// All routes require authentication
router.use(protect);

// User profile routes (user can access own profile, admin can access any)
router.get('/:id', param('id').isMongoId().withMessage('Invalid user ID'), ownerOrAdmin, getUser);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.put('/:id', authorize('admin'), param('id').isMongoId().withMessage('Invalid user ID'), updateUserValidation, updateUser);
router.delete('/:id', authorize('admin'), param('id').isMongoId().withMessage('Invalid user ID'), deleteUser);
router.put('/:id/block', authorize('admin'), param('id').isMongoId().withMessage('Invalid user ID'), toggleBlockValidation, toggleUserBlock);
router.get('/admin/stats', authorize('admin'), getUserStats);

export default router;
