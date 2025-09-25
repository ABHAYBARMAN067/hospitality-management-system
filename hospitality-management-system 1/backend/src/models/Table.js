import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["available", "booked"], default: "available" },
  price: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Table", tableSchema);
