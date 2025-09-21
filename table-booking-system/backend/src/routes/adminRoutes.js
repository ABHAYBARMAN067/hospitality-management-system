const express = require('express');
const {
  getDashboardStats,
  getAllHotels,
  getAllBookings,
  getAllUsers,
  createHotelAdmin,
  updateBookingStatusAdmin
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats);

// Hotel management routes
router.get('/hotels', getAllHotels);
router.post('/hotels', createHotelAdmin);

// Booking management routes
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatusAdmin);

// User management routes
router.get('/users', getAllUsers);

module.exports = router;
