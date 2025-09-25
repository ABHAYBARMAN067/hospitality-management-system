const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant is required'],
  },
  items: [{
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Delivery address is required'],
    trim: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    required: [true, 'Payment method is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
