import Booking from "../models/Booking.js";
import Table from "../models/Table.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { hotel, table, date, time, price } = req.body;

    // Check if table already booked
    const existingBooking = await Booking.findOne({ table, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: "Table already booked for this slot" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      hotel,
      table,
      date,
      time,
      price,
    });

    // Update table status
    await Table.findByIdAndUpdate(table, { status: "booked" });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("hotel table");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
