const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getAvailableTables,
  getHotelMenu
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/:id', getHotel);
router.get('/:id/tables/available', getAvailableTables);
router.get('/:id/menu', getHotelMenu);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createHotel);
router.put('/:id', protect, authorize('admin'), updateHotel);
router.delete('/:id', protect, authorize('admin'), deleteHotel);

module.exports = router;
