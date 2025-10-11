// backend/routes/bookings.js
import express from 'express';
import Booking from '../models/Booking.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// User can create a booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { restaurantId, date, time, guests } = req.body;
    const booking = await Booking.create({
      restaurant: restaurantId,
      user: req.user.id,
      date,
      time,
      guests,
    });
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
