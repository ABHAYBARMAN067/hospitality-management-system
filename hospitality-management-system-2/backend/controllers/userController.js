const express = require('express');
const User = require('../models/User');
const TableBooking = require('../models/TableBooking');
const Order = require('../models/Order');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get user bookings
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await TableBooking.find({ userId: req.user._id })
      .populate('restaurantId', 'name cuisineType location images')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get user orders
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('restaurantId', 'name cuisineType location')
      .populate('items.menuItemId', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Add restaurant to favorites
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(restaurantId)) {
      user.favorites.push(restaurantId);
      await user.save();
    }

    res.json({ message: 'Restaurant added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove restaurant from favorites
router.delete('/favorites', authMiddleware, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(id => id.toString() !== restaurantId);
    await user.save();

    res.json({ message: 'Restaurant removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Get user favorites
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
