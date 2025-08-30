import express from "express";
import { getHotels, getHotelById, createHotel } from "../controllers/hotelController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all hotels
router.get("/", getHotels);

// Get hotel by ID
router.get("/:id", getHotelById);

// Create hotel (admin only)
router.post("/", protect, admin, createHotel);

export default router;
