// backend/models/Restaurant.js
import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  contactNumber: String,
  email: String,
  imageUrl: String,
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  } // Ye field admin ka ID store karegi
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);
