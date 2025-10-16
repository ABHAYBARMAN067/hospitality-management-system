import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken } from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

// Create a new order (user)
router.post('/', verifyToken, createOrder);

// Get orders for the logged-in user
router.get('/my-orders', verifyToken, getUserOrders);

// Get all orders (admin only)
router.get('/', verifyToken, adminAuth, getAllOrders);

// Update order status (admin/restaurant owner)
router.put('/:id/status', verifyToken, adminAuth, updateOrderStatus);

export default router;
