const Reservation = require('../models/Reservation');
const Settings = require('../models/Settings');

// Get all reservations (admin only)
const getAllReservations = async (req, res) => {
  try {
    const { status, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(query);

    res.json({
      reservations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single reservation
const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create reservation (public)
const createReservation = async (req, res) => {
  try {
    const { customerName, email, phone, date, time, partySize, notes } = req.body;

    // Validate required fields
    if (!customerName || !email || !phone || !date || !time || !partySize) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if date is in the past
    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: 'Date cannot be in the past' });
    }

    // Get settings for validation
    const settings = await Settings.findOne() || {};

    // Validate time within open hours
    const [hours, minutes] = time.split(':');
    const reservationTime = parseInt(hours) * 60 + parseInt(minutes);
    const [openStart] = (settings.openHours?.start || '10:00').split(':');
    const [openEnd] = (settings.openHours?.end || '23:00').split(':');
    const openStartMinutes = parseInt(openStart) * 60;
    const openEndMinutes = parseInt(openEnd) * 60;

    if (reservationTime < openStartMinutes || reservationTime > openEndMinutes) {
      return res.status(400).json({ message: 'Time must be within open hours' });
    }

    // Validate party size
    if (partySize > (settings.maxPartySize || 10)) {
      return res.status(400).json({ message: 'Party size exceeds maximum allowed' });
    }

    const reservation = new Reservation({
      customerName,
      email,
      phone,
      date,
      time,
      partySize,
      notes,
    });

    await reservation.save();

    // TODO: Send confirmation email

    res.status(201).json({ reservation });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update reservation (admin only)
const updateReservation = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete reservation (admin only)
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get stats (admin only)
const getStats = async (req, res) => {
  try {
    const pending = await Reservation.countDocuments({ status: 'pending' });
    const confirmed = await Reservation.countDocuments({ status: 'confirmed' });
    const cancelled = await Reservation.countDocuments({ status: 'cancelled' });

    res.json({ pending, confirmed, cancelled });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  getStats,
};
