import Booking from "../models/Booking.js";
import Table from "../models/Table.js";
import Hotel from "../models/Hotel.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { hotel, table, date, time, price } = req.body;

    // Check if hotel exists
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    // Check if table exists
    const tableExists = await Table.findById(table);
    if (!tableExists) {
      return res.status(404).json({
        success: false,
        message: "Table not found"
      });
    }

    // Validate date (must be future date)
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({ 
        success: false,
        message: "Booking date must be a future date" 
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Please use HH:MM format"
      });
    }

    // Check if table already booked for the given date and time
    const existingBooking = await Booking.findOne({
      table,
      date: bookingDate,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Table already booked for this slot"
      });
    }

    // Validate price
    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking price"
      });
    }

    // Check table price matches
    if (tableExists.price !== price) {
      return res.status(400).json({
        success: false,
        message: "Table price mismatch"
      });
    }

    // Check if table belongs to the specified hotel
    if (tableExists.hotel.toString() !== hotel) {
      return res.status(400).json({
        success: false,
        message: "Table does not belong to the specified hotel"
      });
    }

    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      hotel,
      table,
      date: bookingDate,
      time,
      price,
      status: 'confirmed'
    });

    // Update table status
    await Table.findByIdAndUpdate(table, { 
      status: "booked",
      lastBookingDate: bookingDate
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: "Booking created successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hotel table")
      .sort({ date: 1, time: 1 }); // Sort by date and time

    res.json({
      success: true,
      data: bookings,
      message: "Bookings fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking"
      });
    }

    // Check if booking is in the future
    const bookingDate = new Date(booking.date);
    const today = new Date();
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel past bookings"
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update table status
    await Table.findByIdAndUpdate(booking.table, { status: 'available' });

    res.json({
      success: true,
      data: booking,
      message: "Booking cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { date, time } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking"
      });
    }

    // Validate new date
    const newDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot update to a past date"
      });
    }

    // Check if new slot is available
    const existingBooking = await Booking.findOne({
      table: booking.table,
      date: newDate,
      time,
      status: { $ne: 'cancelled' },
      _id: { $ne: booking._id }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Selected time slot is not available"
      });
    }

    // Update booking
    booking.date = newDate;
    booking.time = time;
    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: "Booking updated successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
