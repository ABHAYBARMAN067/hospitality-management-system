import express from 'express';
import fileUpload from '../middlewares/fileUpload.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import {
  addRestaurant,
  getMyRestaurants,
  getBookings,
  updateBookingStatus
} from '../controllers/adminController.js';

const router = express.Router();

// Admin can view only their own restaurants
router.get('/my-restaurants', verifyToken, verifyAdmin, getMyRestaurants);

// Admin can add a new restaurant with image upload
router.post(
  '/restaurants',
  verifyToken,
  verifyAdmin,
  fileUpload.single('image'),
  addRestaurant
);

// Admin can view bookings for their restaurants
router.get('/bookings', verifyToken, verifyAdmin, getBookings);

// Admin can update booking status (PATCH)
router.patch('/bookings/:id', verifyToken, verifyAdmin, updateBookingStatus);

export default router;
