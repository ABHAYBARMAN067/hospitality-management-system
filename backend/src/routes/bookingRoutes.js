import express from "express";
import { 
  createBooking, 
  getUserBookings,
  cancelBooking,
  updateBooking 
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create and get bookings
router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);

// Cancel and update bookings
router.put("/cancel/:id", protect, cancelBooking);
router.put("/update/:id", protect, updateBooking);

export default router;
