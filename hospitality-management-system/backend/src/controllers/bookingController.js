import Booking from "../models/Booking.js";
import Table from "../models/Table.js";
import Hotel from "../models/Hotel.js";
import { asyncHandler } from '../utils/errorHandler.js';

// Helper functions
// Validate booking time slot
const isValidTimeSlot = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Check if table is available
const isTableAvailable = async (tableId, date, time) => {
  const startTime = new Date(`${date}T${time}`);
  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours slot

  const existingBooking = await Booking.findOne({
    table: tableId,
    date: date,
    time: time,
    status: { $in: ['confirmed', 'pending'] }
  });

  return !existingBooking;
};

// Create booking
export const createBooking = asyncHandler(async (req, res) => {
  const { hotel, table, date, time, price } = req.body;

  // Validate required fields
  if (!hotel || !table || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: hotel, table, date, time"
    });
  }

  // Validate time format
  if (!isValidTimeSlot(time)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time format. Please use HH:MM format (24-hour)"
    });
  }

  // Check if hotel exists
  const hotelExists = await Hotel.findById(hotel);
  if (!hotelExists) {
    return res.status(404).json({
      success: false,
      message: "Hotel not found"
    });
  }

  // Check if table exists and belongs to the hotel
  const tableExists = await Table.findOne({ _id: table, hotel: hotel });
  if (!tableExists) {
    return res.status(404).json({
      success: false,
      message: "Table not found or doesn't belong to the specified hotel"
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

  // Check if the table is available
  const tableAvailable = await isTableAvailable(table, date, time);
  if (!tableAvailable) {
    return res.status(400).json({
      success: false,
      message: "Table is already booked for this time slot"
    });
  }

  // Start a session for transaction
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // Create the booking with pending status
    const booking = await Booking.create([{
      user: req.user._id,
      hotel,
      table,
      date,
      time,
      price,
      status: 'pending',
      bookingCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    }], { session });

    // Update table availability
    await Table.findByIdAndUpdate(
      table,
      { $push: { bookings: booking[0]._id } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking[0]
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Get bookings for user
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("hotel table")
    .sort({ date: 1, time: 1 }); // Sort by date and time

  res.json({
    success: true,
    data: bookings,
    message: "Bookings fetched successfully"
  });
});

// Cancel booking
export const cancelBooking = asyncHandler(async (req, res) => {
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
});

// Update booking
export const updateBooking = asyncHandler(async (req, res) => {
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

  // Validate time format
  if (!isValidTimeSlot(time)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time format. Please use HH:MM format (24-hour)"
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
});
