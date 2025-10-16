import Order from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryType, deliveryAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!restaurantId || !items || !totalAmount || !deliveryType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If deliveryType is home_delivery, deliveryAddress is required
    if (deliveryType === 'home_delivery' && !deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address is required for home delivery' });
    }

    // If deliveryType is pickup, set deliveryAddress to restaurant address or empty
    let finalDeliveryAddress = deliveryAddress;
    if (deliveryType === 'pickup') {
      finalDeliveryAddress = 'Pickup from restaurant';
    }

    const order = new Order({
      userId: req.user.id,
      restaurantId,
      items,
      totalAmount,
      deliveryType,
      deliveryAddress: finalDeliveryAddress,
      paymentMethod: paymentMethod || 'cash'
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get orders for the logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('restaurantId', 'name address')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get all orders (for admin/restaurant owner)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name address')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email').populate('restaurantId', 'name address');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
