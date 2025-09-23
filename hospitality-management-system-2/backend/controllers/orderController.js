const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, restaurantId, items, totalPrice, type } = req.body;
    const order = new Order({ userId, restaurantId, items, totalPrice, type });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders for user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('restaurantId items.menuItemId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
