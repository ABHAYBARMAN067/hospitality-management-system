import express from "express";
import { createHotel, getHotelsByCity, getHotelById } from "../controllers/hotelController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// NOTE: Field name must match frontend FormData key
router.post("/", protect, upload.fields([
  { name: 'hotelImage', maxCount: 1 },
  { name: 'dishImage0', maxCount: 1 },
  { name: 'dishImage1', maxCount: 1 },
  { name: 'dishImage2', maxCount: 1 }
]), createHotel);
router.get("/city/:city", getHotelsByCity);
router.get("/:id", getHotelById);

export default router;
