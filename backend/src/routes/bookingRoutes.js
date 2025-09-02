import express from "express";
import { createBooking, getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/user", protect, getUserBookings);

export default router;
