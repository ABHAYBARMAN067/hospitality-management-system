const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: [true, 'Menu item must belong to a hotel']
  },
  name: {
    type: String,
    required: [true, 'Please add a menu item name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [300, 'Description cannot be more than 300 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Appetizers', 'Soups', 'Salads', 'Main Course', 'Desserts', 'Beverages', 'Sides', 'Specials']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be positive']
  },
  image: {
    type: String // Image URL
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [120, 'Preparation time cannot exceed 120 minutes'],
    default: 15
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    enum: ['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'Fish', 'Sesame']
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number, // in grams
    carbs: Number, // in grams
    fat: Number, // in grams
    fiber: Number // in grams
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for text search
menuItemSchema.index({
  name: 'text',
  description: 'text',
  ingredients: 'text'
});

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Static method to find available menu items by category
menuItemSchema.statics.findByCategory = function(hotelId, category) {
  return this.find({
    hotel: hotelId,
    category: category,
    isAvailable: true,
    isActive: true
  }).populate('hotel');
};

module.exports = mongoose.model('MenuItem', menuItemSchema);
