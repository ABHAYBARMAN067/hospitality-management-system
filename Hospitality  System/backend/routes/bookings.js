// backend/routes/bookings.js
import express from 'express';
import TableBooking from '../models/TableBooking.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// User can create a booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { restaurantId, date, time, guests } = req.body;
    const booking = await TableBooking.create({
      restaurantId,
      userId: req.user.id,
      date,
      time,
      seats: guests,
    });
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
