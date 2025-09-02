import express from "express";
import { createTable, getTablesByHotel } from "../controllers/tableController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTable);
router.get("/:hotelId", getTablesByHotel);

export default router;
