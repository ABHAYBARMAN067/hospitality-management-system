import Table from "../models/Table.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

// Create table
export const createTable = async (req, res) => {
  try {
    const { hotel, name, capacity, price } = req.body;

    // Validate hotel exists
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    // Validate capacity
    if (capacity <= 0 || capacity > 20) {
      return res.status(400).json({
        success: false,
        message: "Table capacity must be between 1 and 20"
      });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Table price must be greater than 0"
      });
    }

    const table = await Table.create({ 
      hotel, 
      name, 
      capacity, 
      price,
      status: "available"
    });

    res.status(201).json({
      success: true,
      data: table,
      message: "Table created successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get tables by hotel
export const getTablesByHotel = async (req, res) => {
  try {
    // Check if hotel exists
    const hotelExists = await Hotel.findById(req.params.hotelId);
    if (!hotelExists) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    const { date, time } = req.query;

    // Get all tables for the hotel
    const tables = await Table.find({ hotel: req.params.hotelId });

    if (date && time) {
      // If date and time are provided, check availability
      const bookings = await Booking.find({
        hotel: req.params.hotelId,
        date: new Date(date),
        time,
        status: { $ne: 'cancelled' }
      });

      // Mark tables as booked if they have bookings for the specified time
      const bookedTableIds = bookings.map(booking => booking.table.toString());
      
      const availabilityCheckedTables = tables.map(table => ({
        ...table.toObject(),
        status: bookedTableIds.includes(table._id.toString()) ? 'booked' : 'available'
      }));

      res.json({
        success: true,
        data: availabilityCheckedTables,
        message: "Tables with availability status fetched successfully"
      });
    } else {
      // If no date/time specified, return current table status
      res.json({
        success: true,
        data: tables,
        message: "Tables fetched successfully"
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update table
export const updateTable = async (req, res) => {
  try {
    const { name, capacity, price, status } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { name, capacity, price, status },
      { new: true }
    );
    
    if (!table) {
      return res.status(404).json({ 
        success: false,
        message: "Table not found" 
      });
    }
    
    res.json({
      success: true,
      data: table,
      message: "Table updated successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Delete table
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    
    if (!table) {
      return res.status(404).json({ 
        success: false,
        message: "Table not found" 
      });
    }
    
    res.json({
      success: true,
      message: "Table deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
