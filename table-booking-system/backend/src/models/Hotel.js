const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code']
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      default: 'USA'
    }
  },
  phone: {
    type: String,
    required: false,
    match: [/^\+?[\d\s-()]+$/, 'Please add a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please add a valid website URL']
  },
  images: [{
    type: String // Array of image URLs
  }],
  cuisine: [{
    type: String,
    enum: ['American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'French', 'Thai', 'Mediterranean', 'Other']
  }],
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Parking', 'Air Conditioning', 'Outdoor Seating', 'Bar', 'Live Music', 'Private Dining', 'Wheelchair Accessible']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false  // Made optional to fix validation error
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for text search
hotelSchema.index({
  name: 'text',
  description: 'text',
  'address.city': 'text',
  cuisine: 'text'
});

// Virtual for full address
hotelSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

module.exports = mongoose.model('Hotel', hotelSchema);
