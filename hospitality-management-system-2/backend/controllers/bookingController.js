const express = require('express');
const TableBooking = require('../models/TableBooking');

const router = express.Router();

// Create booking
router.post('/', async (req, res) => {
  try {
    const { userId, restaurantId, date, time, seats } = req.body;
    const booking = new TableBooking({ userId, restaurantId, date, time, seats });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await TableBooking.find({ userId: req.params.userId }).populate('restaurantId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await TableBooking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
