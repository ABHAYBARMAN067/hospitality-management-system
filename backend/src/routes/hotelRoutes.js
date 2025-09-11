import express from "express";
import {
  createHotel,
  getHotelsByCity,
  getHotelById,
  updateHotel,
  deleteHotel
} from "../controllers/hotelController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Public routes
router.get("/city/:city", getHotelsByCity);
router.get("/:id", getHotelById);

// Protected routes
router.use(protect);
router.post("/", upload.fields([
  { name: 'hotelImage', maxCount: 1 },
  { name: 'dishImage0', maxCount: 1 },
  { name: 'dishImage1', maxCount: 1 },
  { name: 'dishImage2', maxCount: 1 }
]), createHotel);

router.put("/:id", updateHotel);
router.delete("/:id", deleteHotel);

export default router;

try {
  // code here
} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message
  });
}
