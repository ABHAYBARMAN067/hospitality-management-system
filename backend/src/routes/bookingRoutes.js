import express from "express";
import {
  createBooking,
  getUserBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create booking
router.post("/", protect, createBooking);

// Get bookings for logged-in user
router.get("/user", protect, getUserBookings);

// Update booking status (admin only)
router.put("/:id/status", protect, admin, updateBookingStatus);

export default router;
