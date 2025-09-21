const Hotel = require('../models/Hotel');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

// @desc    Get all hotels with filtering and search
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    let query = { isActive: true };

    // Text search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by cuisine
    if (req.query.cuisine) {
      query.cuisine = { $in: req.query.cuisine.split(',') };
    }

    // Filter by price range
    if (req.query.priceRange) {
      query.priceRange = { $in: req.query.priceRange.split(',') };
    }

    // Filter by city
    if (req.query.city) {
      query['address.city'] = new RegExp(req.query.city, 'i');
    }

    // Filter by rating
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Filter by amenities
    if (req.query.amenities) {
      query.amenities = { $in: req.query.amenities.split(',') };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Sorting
    let sort = {};
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy.split(',').join(' ');
      sort = sortBy;
    } else {
      sort = '-createdAt';
    }

    const hotels = await Hotel.find(query)
      .populate('owner', 'name email')
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    // Get total count for pagination
    const total = await Hotel.countDocuments(query);

    res.json({
      success: true,
      count: hotels.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: hotels
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting hotels'
    });
  }
};


const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting hotel'
    });
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res) => {
  try {
    // Add owner to req.body
    req.body.owner = req.user.id;

    const hotel = await Hotel.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Hotel with this information already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating hotel'
    });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

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
        message: 'Not authorized to update this hotel'
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating hotel'
    });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

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
        message: 'Not authorized to delete this hotel'
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting hotel'
    });
  }
};

// @desc    Get available tables for a hotel
// @route   GET /api/hotels/:id/tables/available
// @access  Public
const getAvailableTables = async (req, res) => {
  try {
    const { date, startTime, endTime, guests } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, startTime, and endTime'
      });
    }

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Find tables that can accommodate the number of guests
    let tables = await Table.find({
      hotel: req.params.id,
      isActive: true,
      capacity: { $gte: parseInt(guests) || 1 }
    });

    // Filter out tables that are already booked
    const availableTables = [];
    for (const table of tables) {
      const isAvailable = await Booking.checkTableAvailability(
        table._id,
        new Date(date),
        startTime,
        endTime
      );

      if (isAvailable) {
        availableTables.push(table);
      }
    }

    res.json({
      success: true,
      count: availableTables.length,
      data: availableTables
    });
  } catch (error) {
    console.error('Get available tables error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting available tables'
    });
  }
};

// @desc    Get hotel menu
// @route   GET /api/hotels/:id/menu
// @access  Public
const getHotelMenu = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {
      hotel: req.params.id,
      isAvailable: true,
      isActive: true
    };

    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query)
      .populate('hotel', 'name')
      .sort('category name');

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Get hotel menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting hotel menu'
    });
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getAvailableTables,
  getHotelMenu
};
