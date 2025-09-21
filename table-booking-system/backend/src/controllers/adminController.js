const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      success: true,
      data: {
        totalBookings,
        totalHotels,
        totalUsers,
        totalRevenue: revenue
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard stats'
    });
  }
};

// @desc    Get all hotels (admin view)
// @route   GET /api/admin/hotels
// @access  Private/Admin
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .populate('owner', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Get all hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting hotels'
    });
  }
};

// @desc    Get all bookings (admin view)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('table', 'tableNumber capacity')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting bookings'
    });
  }
};

// @desc    Get all users (admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting users'
    });
  }
};

// @desc    Create hotel (admin)
// @route   POST /api/admin/hotels
// @access  Private/Admin
const createHotelAdmin = async (req, res) => {
  try {
    // Owner field is now optional in the model, so no need to set it here
    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel admin error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Hotel with this information already exists'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating hotel'
    });
  }
};

// @desc    Update booking status (admin)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('table', 'tableNumber capacity');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllHotels,
  getAllBookings,
  getAllUsers,
  createHotelAdmin,
  updateBookingStatusAdmin
};
