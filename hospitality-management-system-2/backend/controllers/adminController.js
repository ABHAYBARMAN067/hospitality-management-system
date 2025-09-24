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

    // Validate field lengths
    if (name.length > 100) {
      return res.status(400).json({ error: 'Restaurant name must be less than 100 characters' });
    }
    if (address.length > 200) {
      return res.status(400).json({ error: 'Address must be less than 200 characters' });
    }
    if (contact.length > 20) {
      return res.status(400).json({ error: 'Contact must be less than 20 characters' });
    }
    if (cuisineType.length > 50) {
      return res.status(400).json({ error: 'Cuisine type must be less than 50 characters' });
    }
    if (location.length > 100) {
      return res.status(400).json({ error: 'Location must be less than 100 characters' });
    }

    // Get uploaded image URLs from Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
      console.log(`Uploaded ${req.files.length} images for restaurant: ${name}`);
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
    console.log(`Restaurant created successfully: ${name} (ID: ${restaurant._id})`);
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.message.includes('Cloudinary')) {
      return res.status(500).json({
        error: 'Image upload failed. Please check your Cloudinary configuration.'
      });
    }

    res.status(500).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

module.exports = router;
