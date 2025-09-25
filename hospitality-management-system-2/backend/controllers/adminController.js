const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Booking = require('../models/Booking');
const Order = require('../models/Order');

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalOrders = await Order.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalRestaurants,
      totalBookings,
      totalOrders,
      pendingBookings,
      pendingOrders,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all bookings for admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all orders for admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create restaurant (admin only)
const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, location, contact, cuisineType, ownerId } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const restaurant = new Restaurant({
      name,
      description,
      address,
      location,
      contact,
      cuisineType,
      images,
      ownerId,
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  getAllOrders,
  createRestaurant,
};
