const express = require('express');
const {
  getAllOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const authenticate = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, adminAuth, getAllOrders);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's orders
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authenticate, getUserOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - items
 *               - totalPrice
 *               - deliveryAddress
 *               - paymentMethod
 *             properties:
 *               restaurantId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *               deliveryAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, online]
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.put('/:id/status', authenticate, adminAuth, updateOrderStatus);

module.exports = router;
