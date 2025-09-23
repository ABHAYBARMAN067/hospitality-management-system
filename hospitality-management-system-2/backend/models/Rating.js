const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);
