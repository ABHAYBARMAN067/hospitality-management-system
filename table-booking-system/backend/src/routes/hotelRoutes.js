const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getAvailableTables,
  getHotelMenu,
  getTopDishes,
  uploadTopDishes
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/auth');

// Multer config import
const upload = require('../config/multer');

// Import menu item routes
const menuItemRoutes = require('./menuItemRoutes');

const router = express.Router();

// Nested routes for menu items under hotels
router.use('/:hotelId/menu-items', menuItemRoutes);

// ----------------- Public Routes -----------------
router.get('/', getHotels);
router.get('/:id', getHotel);
router.get('/:id/tables/available', getAvailableTables);
router.get('/:id/menu', getHotelMenu);
router.get('/:id/top-dishes', getTopDishes);

// ----------------- Protected/Admin Routes -----------------
router.post('/', protect, authorize('admin'), createHotel);
router.put('/:id', protect, authorize('admin'), updateHotel);
router.delete('/:id', protect, authorize('admin'), deleteHotel);

// Upload top dishes (with images)
router.post(
  '/:id/top-dishes/upload',
  protect,
  authorize('admin'),
  upload.array('dishImages', 5), // max 5 images at once
  uploadTopDishes
);

module.exports = router;
