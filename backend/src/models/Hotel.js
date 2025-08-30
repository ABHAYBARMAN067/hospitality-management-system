import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String }, // Cloudinary URL
    topDishes: [{ name: String, image: String }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
