const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      hotel,
      table,
      bookingDate,
      startTime,
      endTime,
      numberOfGuests,
      specialRequests,
      menuItems
    } = req.body;

    // Validate required fields
    if (!hotel || !table || !bookingDate || !startTime || !endTime || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required booking information'
      });
    }

    // Check if hotel exists
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check if table exists and belongs to the hotel
    const tableExists = await Table.findById(table);
    if (!tableExists || tableExists.hotel.toString() !== hotel) {
      return res.status(404).json({
        success: false,
        message: 'Table not found or does not belong to the specified hotel'
      });
    }

    // Check table capacity
    if (numberOfGuests > tableExists.capacity) {
      return res.status(400).json({
        success: false,
        message: `Table capacity is ${tableExists.capacity}, but ${numberOfGuests} guests requested`
      });
    }

    // Check table availability
    const isAvailable = await Booking.checkTableAvailability(
      table,
      new Date(bookingDate),
      startTime,
      endTime
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Table is not available for the selected time slot'
      });
    }

    // Calculate duration in hours
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const duration = (end - start) / (1000 * 60 * 60);

    // Calculate total amount (table price + menu items)
    let totalAmount = tableExists.pricePerHour * duration;

    // Add menu items cost
    let bookingMenuItems = [];
    if (menuItems && menuItems.length > 0) {
      for (const item of menuItems) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (menuItem) {
          totalAmount += menuItem.price * item.quantity;
          bookingMenuItems.push({
            menuItem: item.menuItem,
            quantity: item.quantity,
            price: menuItem.price,
            specialInstructions: item.specialInstructions
          });
        }
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      hotel,
      table,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      duration,
      numberOfGuests,
      totalAmount,
      specialRequests,
      menuItems: bookingMenuItems
    });

    // Populate the booking response
    await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'hotel', select: 'name address' },
      { path: 'table', select: 'tableNumber capacity location' },
      { path: 'menuItems.menuItem', select: 'name price category' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Booking conflict detected'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating booking'
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;

    let query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate([
        { path: 'hotel', select: 'name address phone' },
        { path: 'table', select: 'tableNumber capacity location' },
        { path: 'menuItems.menuItem', select: 'name price category' }
      ])
      .sort('-createdAt')
      .limit(limit)
      .skip(startIndex);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting bookings'
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate([
        { path: 'user', select: 'name email phone' },
        { path: 'hotel', select: 'name address phone email' },
        { path: 'table', select: 'tableNumber capacity location pricePerHour' },
        { path: 'menuItems.menuItem', select: 'name price category description' }
      ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting booking'
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this time'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking'
    });
  }
};

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed', 'no-show'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'name email phone' },
      { path: 'hotel', select: 'name' },
      { path: 'table', select: 'tableNumber' }
    ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status'
    });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { status, hotel, date, page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (hotel) {
      query.hotel = hotel;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.bookingDate = { $gte: startDate, $lt: endDate };
    }

    const bookings = await Booking.find(query)
      .populate([
        { path: 'user', select: 'name email phone' },
        { path: 'hotel', select: 'name address' },
        { path: 'table', select: 'tableNumber capacity' }
      ])
      .sort('-createdAt')
      .limit(limit)
      .skip(startIndex);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: bookings
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting bookings'
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  updateBookingStatus,
  getAllBookings
};
