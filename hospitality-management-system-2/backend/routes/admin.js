const express = require('express');
const {
  getDashboardStats,
  getAllBookings,
  getAllOrders,
  createRestaurant,
} = require('../controllers/adminController');
const { upload } = require('../middlewares/fileUpload');
const authenticate = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', authenticate, adminAuth, getDashboardStats);

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       401:
 *         description: Unauthorized
 */
router.get('/bookings', authenticate, adminAuth, getAllBookings);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', authenticate, adminAuth, getAllOrders);

/**
 * @swagger
 * /api/admin/restaurants:
 *   post:
 *     summary: Create a new restaurant (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - location
 *               - contact
 *               - cuisineType
 *               - ownerId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: string
 *               contact:
 *                 type: string
 *               cuisineType:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/restaurants', authenticate, adminAuth, upload.array('images', 5), createRestaurant);

module.exports = router;
