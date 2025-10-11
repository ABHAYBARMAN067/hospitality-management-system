import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tableNumber: Number,
  date: Date,
  guests: Number,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
