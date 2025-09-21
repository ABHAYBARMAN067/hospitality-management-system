const Table = require('../models/Table');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// @desc    Get all tables for a hotel
// @route   GET /api/hotels/:hotelId/tables
// @access  Private/Admin
const getTables = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status, location, minCapacity, maxCapacity, page = 1, limit = 10 } = req.query;

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership or admin
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access tables for this hotel'
      });
    }

    let query = { hotel: hotelId };

    if (status !== undefined) {
      query.isActive = status === 'active';
    }

    if (location) {
      query.location = location;
    }

    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
    }

    const startIndex = (page - 1) * limit;

    const tables = await Table.find(query)
      .populate('hotel', 'name')
      .sort('tableNumber')
      .limit(limit)
      .skip(startIndex);

    const total = await Table.countDocuments(query);

    res.json({
      success: true,
      count: tables.length,
      total,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: tables
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting tables'
    });
  }
};

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Private/Admin
const getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id)
      .populate('hotel', 'name address phone');

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Check ownership or admin
    if (table.hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this table'
      });
    }

    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    console.error('Get table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting table'
    });
  }
};

// @desc    Create new table
// @route   POST /api/hotels/:hotelId/tables
// @access  Private/Admin
const createTable = async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership or admin
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create tables for this hotel'
      });
    }

    // Add hotel to req.body
    req.body.hotel = hotelId;

    const table = await Table.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: table
    });
  } catch (error) {
    console.error('Create table error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Table number already exists for this hotel'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating table'
    });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Admin
const updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Check ownership or admin
    const hotel = await Hotel.findById(table.hotel);
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this table'
      });
    }

    const updatedTable = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Table updated successfully',
      data: updatedTable
    });
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating table'
    });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Check ownership or admin
    const hotel = await Hotel.findById(table.hotel);
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this table'
      });
    }

    // Check if table has active bookings
    const activeBookings = await Booking.find({
      table: req.params.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete table with active bookings'
      });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting table'
    });
  }
};

// @desc    Toggle table status
// @route   PUT /api/tables/:id/toggle-status
// @access  Private/Admin
const toggleTableStatus = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    // Check ownership or admin
    const hotel = await Hotel.findById(table.hotel);
    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this table'
      });
    }

    table.isActive = !table.isActive;
    await table.save();

    res.json({
      success: true,
      message: `Table ${table.isActive ? 'activated' : 'deactivated'} successfully`,
      data: table
    });
  } catch (error) {
    console.error('Toggle table status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error toggling table status'
    });
  }
};

// @desc    Get table availability for a specific date range
// @route   GET /api/tables/:id/availability
// @access  Public
const getTableAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, startTime, and endTime'
      });
    }

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    const isAvailable = await Booking.checkTableAvailability(
      req.params.id,
      new Date(date),
      startTime,
      endTime
    );

    res.json({
      success: true,
      tableId: req.params.id,
      date,
      startTime,
      endTime,
      isAvailable,
      table: {
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        location: table.location
      }
    });
  } catch (error) {
    console.error('Get table availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting table availability'
    });
  }
};

module.exports = {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
  toggleTableStatus,
  getTableAvailability
};
