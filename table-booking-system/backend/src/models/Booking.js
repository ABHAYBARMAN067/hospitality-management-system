const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'Booking must be for a hotel']
  },
  table: {
    type: mongoose.Schema.ObjectId,
    ref: 'Table',
    required: [true, 'Booking must be for a table']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please add a booking date']
  },
  startTime: {
    type: String,
    required: [true, 'Please add start time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time in HH:MM format']
  },
  endTime: {
    type: String,
    required: [true, 'Please add end time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time in HH:MM format']
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Please add duration'],
    min: [0.5, 'Duration must be at least 30 minutes'],
    max: [8, 'Duration cannot exceed 8 hours']
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Please add number of guests'],
    min: [1, 'Number of guests must be at least 1']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please add total amount'],
    min: [0, 'Total amount must be positive']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online', 'bank_transfer'],
    default: 'cash'
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  menuItems: [{
    menuItem: {
      type: mongoose.Schema.ObjectId,
      ref: 'MenuItem'
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive']
    },
    specialInstructions: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for efficient queries
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ hotel: 1, bookingDate: 1, startTime: 1 });
bookingSchema.index({ table: 1, bookingDate: 1, startTime: 1 });
bookingSchema.index({ bookingReference: 1 });

// Virtual for checking if booking is active
bookingSchema.virtual('isActive').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual for checking if booking can be cancelled
bookingSchema.virtual('canBeCancelled').get(function() {
  const now = new Date();
  const bookingDateTime = new Date(`${this.bookingDate.toISOString().split('T')[0]}T${this.startTime}`);
  const hoursDifference = (bookingDateTime - now) / (1000 * 60 * 60);
  return hoursDifference > 2 && ['pending', 'confirmed'].includes(this.status);
});

// Pre-save middleware to generate booking reference
bookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingReference = `BK${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Static method to check table availability
bookingSchema.statics.checkTableAvailability = async function(tableId, bookingDate, startTime, endTime, excludeBookingId = null) {
  const query = {
    table: tableId,
    bookingDate: bookingDate,
    status: { $in: ['pending', 'confirmed'] }
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await this.find(query);
  return conflictingBookings.length === 0;
};

module.exports = mongoose.model('Booking', bookingSchema);
