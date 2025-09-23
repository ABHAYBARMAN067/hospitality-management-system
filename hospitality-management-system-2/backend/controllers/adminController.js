const express = require('express');
const Restaurant = require('../models/Restaurant');
const TableBooking = require('../models/TableBooking');
const Order = require('../models/Order');

const router = express.Router();

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await TableBooking.find().populate('userId restaurantId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId restaurantId items.menuItemId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create restaurant
router.post('/restaurants', async (req, res) => {
  try {
    const { name, address, contact, images, cuisineType, location, ownerId } = req.body;
    const restaurant = new Restaurant({ name, address, contact, images, cuisineType, location, ownerId });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
