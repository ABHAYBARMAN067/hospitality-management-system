const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Rating = require('../models/Rating');

const router = express.Router();

// Get all restaurants with filters
router.get('/', async (req, res) => {
  try {
    const { cuisine, location, rating } = req.query;
    let query = {};
    if (cuisine) query.cuisineType = cuisine;
    if (location) query.location = location;
    if (rating) query.averageRating = { $gte: rating };
    const restaurants = await Restaurant.find(query).populate('menu');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menu');
    const ratings = await Rating.find({ restaurantId: req.params.id });
    res.json({ restaurant, ratings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add menu item
router.post('/:id/menu', async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const menuItem = new MenuItem({ restaurantId: req.params.id, name, description, price, image });
    await menuItem.save();
    await Restaurant.findByIdAndUpdate(req.params.id, { $push: { menu: menuItem._id } });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
