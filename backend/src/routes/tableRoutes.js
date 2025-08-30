import express from "express";
import { getTables, createTable, updateTable } from "../controllers/tableController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get tables for a hotel
router.get("/:hotelId", getTables);

// Create table (admin only)
router.post("/", protect, admin, createTable);

// Update table availability (admin only)
router.put("/:id", protect, admin, updateTable);

export default router;
