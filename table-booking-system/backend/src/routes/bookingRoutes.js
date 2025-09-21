const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  updateBookingStatus,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Admin routes
router.get('/', authorize('admin'), getAllBookings);
router.put('/:id/status', authorize('admin'), updateBookingStatus);

module.exports = router;
