const express = require('express');
const Restaurant = require('../models/Restaurant');
const TableBooking = require('../models/TableBooking');
const Order = require('../models/Order');
const { uploadMultiple } = require('../middlewares/fileUpload');

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

// Get all restaurant owners
router.get('/owners', async (req, res) => {
  try {
    const User = require('../models/User');
    const owners = await User.find({ role: 'owner' }).select('name email _id');
    res.json(owners);
  } catch (error) {
    console.error('Error fetching owners:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create restaurant
router.post('/restaurants', uploadMultiple, async (req, res) => {
  try {
    const { name, address, contact, cuisineType, location, ownerId } = req.body;

    // Validate required fields
    if (!name || !address || !contact || !cuisineType || !location) {
      return res.status(400).json({
        error: 'Missing required fields: name, address, contact, cuisineType, location'
      });
    }

    // Get uploaded image URLs from Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }

    const restaurant = new Restaurant({
      name,
      address,
      contact,
      images: imageUrls,
      cuisineType,
      location,
      ownerId: ownerId || null // Make ownerId optional
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
