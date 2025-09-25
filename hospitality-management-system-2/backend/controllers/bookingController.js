const Booking = require('../models/Booking');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('restaurantId', 'name address')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const { restaurantId, date, time, seats, specialRequests } = req.body;

    const booking = new Booking({
      userId: req.user.userId,
      restaurantId,
      date,
      time,
      seats,
      specialRequests,
    });

    await booking.save();
    await booking.populate('restaurantId', 'name');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email').populate('restaurantId', 'name');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is the owner of the booking
    if (booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllBookings,
  getUserBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking,
};
