const express = require('express');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateTopDishStatus
} = require('../controllers/menuItemController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router({ mergeParams: true });

// All routes need hotelId parameter
// GET /api/hotels/:hotelId/menu-items
// POST /api/hotels/:hotelId/menu-items

// Public routes
router.get('/', getMenuItems);
router.get('/:id', getMenuItem);

// Protected routes (Hotel Owner or Admin only)
router.post('/', protect, authorize('admin'), upload.single('image'), createMenuItem);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateMenuItem);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);
router.put('/:id/top-dish', protect, authorize('admin'), updateTopDishStatus);

module.exports = router;
