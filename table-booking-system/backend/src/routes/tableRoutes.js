const express = require('express');
const {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
  toggleTableStatus,
  getTableAvailability
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/:id/availability', getTableAvailability);

// Protected routes (Admin only)
router.get('/hotel/:hotelId', protect, authorize('admin'), getTables);
router.get('/:id', protect, authorize('admin'), getTable);
router.post('/hotel/:hotelId', protect, authorize('admin'), createTable);
router.put('/:id', protect, authorize('admin'), updateTable);
router.delete('/:id', protect, authorize('admin'), deleteTable);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleTableStatus);

module.exports = router;
