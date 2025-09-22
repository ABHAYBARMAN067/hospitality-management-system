import express from 'express';
import { body, param } from 'express-validator';
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order items must be a non-empty array'),
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('orderItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('itemsPrice')
    .isFloat({ min: 0 })
    .withMessage('Items price must be a positive number'),
  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number')
];

const updateOrderStatusValidation = [
  body('orderStatus')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status')
];

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createOrderValidation, createOrder);
router.get('/', getUserOrders);
router.get('/:id', param('id').isMongoId().withMessage('Invalid order ID'), getOrder);

// Admin only routes
router.put('/:id/status', authorize('admin'), updateOrderStatusValidation, updateOrderStatus);
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/admin/stats', authorize('admin'), getOrderStats);

export default router;
