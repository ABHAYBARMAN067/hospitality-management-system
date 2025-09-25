const express = require('express');
const {
  getAllBookings,
  getUserBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const authenticate = require('../middlewares/auth');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (admin only)
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, adminAuth, getAllBookings);

/**
 * @swagger
 * /api/bookings/my:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's bookings
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authenticate, getUserBookings);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
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
 *               - date
 *               - time
 *               - seats
 *             properties:
 *               restaurantId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               seats:
 *                 type: number
 *               specialRequests:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update booking status (admin only)
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
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
 *                 enum: [pending, approved, rejected, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.put('/:id/status', authenticate, adminAuth, updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.put('/:id/cancel', authenticate, cancelBooking);

module.exports = router;
