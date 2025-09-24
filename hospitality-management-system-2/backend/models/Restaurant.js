const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  images: [{ type: String }], 
  cuisineType: { type: String, required: true },
  location: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
