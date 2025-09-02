import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  price: { type: Number, required: true },
  image: { type: String }, // Cloudinary URL
  topDishes: [String],
}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
