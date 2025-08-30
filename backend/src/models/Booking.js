import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
