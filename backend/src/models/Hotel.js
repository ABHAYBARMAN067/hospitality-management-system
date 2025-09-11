import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  price: { type: Number, default: 0 },
  image: { type: String }, // Cloudinary URL
  topDishes: [String],
  dishImages: [String], // Array of dish image URLs
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
