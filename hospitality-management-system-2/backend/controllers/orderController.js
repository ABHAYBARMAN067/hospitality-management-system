const Order = require('../models/Order');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('restaurantId', 'name address')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalPrice, deliveryAddress, paymentMethod } = req.body;

    const order = new Order({
      userId: req.user.userId,
      restaurantId,
      items,
      totalPrice,
      deliveryAddress,
      paymentMethod,
    });

    await order.save();
    await order.populate('restaurantId', 'name');

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update order status (admin/restaurant owner only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email').populate('restaurantId', 'name');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
};
