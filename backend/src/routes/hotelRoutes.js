import express from "express";
import { createHotel, getHotelsByCity, getHotelById } from "../controllers/hotelController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", protect, upload.single("image"), createHotel);
router.get("/city/:city", getHotelsByCity);
router.get("/:id", getHotelById);

export default router;
