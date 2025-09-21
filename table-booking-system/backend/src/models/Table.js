const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'Table must belong to a hotel']
  },
  tableNumber: {
    type: String,
    required: [true, 'Please add a table number'],
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please add table capacity'],
    min: [1, 'Capacity must be at least 1'],
    max: [20, 'Capacity cannot be more than 20']
  },
  location: {
    type: String,
    enum: ['Indoor', 'Outdoor', 'Private Room', 'Window', 'Center'],
    default: 'Indoor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  pricePerHour: {
    type: Number,
    min: [0, 'Price per hour must be positive'],
    default: 0
  },
  amenities: [{
    type: String,
    enum: ['Power Outlet', 'USB Charging', 'Heating', 'Cooling', 'Natural Light', 'Quiet Area']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure unique table numbers within a hotel
tableSchema.index({ hotel: 1, tableNumber: 1 }, { unique: true });

// Virtual for checking if table is available
tableSchema.virtual('isAvailable').get(function() {
  return this.isActive;
});

// Static method to find available tables for a hotel
tableSchema.statics.findAvailableTables = function(hotelId, startTime, endTime) {
  return this.find({
    hotel: hotelId,
    isActive: true
  }).populate('hotel');
};

module.exports = mongoose.model('Table', tableSchema);
