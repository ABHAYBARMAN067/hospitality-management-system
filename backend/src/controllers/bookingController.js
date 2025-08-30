import Booking from "../models/Booking.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { hotel, table, date } = req.body;
    const booking = await Booking.create({
      user: req.user._id,
      hotel,
      table,
      date,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hotel")
      .populate("table");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
