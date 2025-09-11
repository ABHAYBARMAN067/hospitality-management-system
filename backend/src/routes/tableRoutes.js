import express from "express";
import { createTable, getTablesByHotel, updateTable, deleteTable } from "../controllers/tableController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTable);
router.get("/hotel/:hotelId", getTablesByHotel);
router.put("/:id", protect, updateTable);
router.delete("/:id", protect, deleteTable);

export default router;
