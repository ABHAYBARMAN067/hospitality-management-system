const cloudinary = require("../config/cloudinary");
const Hotel = require("../models/Hotel");
const MenuItem = require("../models/MenuItem");

// Helper function: buffer → Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true })
      .select('name description address images rentPerDay rating')
      .sort('name');

    res.json({
      success: true,
      count: hotels.length,
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

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

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

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res) => {
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
        message: 'Not authorized to update this hotel'
      });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: updatedHotel
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
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // This would typically check against bookings to find available tables
    // For now, return all tables as available
    res.json({
      success: true,
      data: {
        hotelId: hotel._id,
        availableTables: hotel.tables || [],
        totalTables: hotel.tables?.length || 0
      }
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
    const menuItems = await MenuItem.find({
      hotel: req.params.id,
      isAvailable: true,
      isActive: true
    }).sort('category name');

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

// @desc    Get top dishes for a hotel
// @route   GET /api/hotels/:id/top-dishes
// @access  Public
const getTopDishes = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.json({
      success: true,
      data: hotel.topDishes || []
    });
  } catch (error) {
    console.error('Get top dishes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting top dishes'
    });
  }
};

// @desc    Upload top dishes with images
// @route   POST /api/hotels/:id/top-dishes/upload
// @access  Private/Admin
const uploadTopDishes = async (req, res) => {
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
        message: 'Not authorized to upload top dishes for this hotel'
      });
    }

    const { dishes } = req.body;
    let parsedDishes = [];

    if (dishes) {
      parsedDishes = JSON.parse(dishes);
    }

    // Upload dish images
    const dishImages = req.files || [];
    for (let i = 0; i < parsedDishes.length && i < dishImages.length; i++) {
      const url = await uploadToCloudinary(dishImages[i].buffer, 'top_dishes');
      parsedDishes[i].image = url;
    }

    // Update hotel with new top dishes
    hotel.topDishes = parsedDishes;
    await hotel.save();

    res.json({
      success: true,
      message: 'Top dishes uploaded successfully',
      data: hotel.topDishes
    });
  } catch (error) {
    console.error('Upload top dishes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading top dishes'
    });
  }
};

// Create Hotel with images + top dishes
const createHotel = async (req, res) => {
  try {
    const {
      hotelName,
      hotelAddress,
      hotelCity,
      hotelState,
      hotelZipCode,
      hotelDescription,
      rentPerDay,
      topDishes,
    } = req.body;

    // Upload hotel image
    let hotelImageUrl = "";
    if (req.files && req.files.hotelImage && req.files.hotelImage[0]) {
      hotelImageUrl = await uploadToCloudinary(
        req.files.hotelImage[0].buffer,
        "hotels"
      );
    }

    // Upload top dishes images
    let parsedTopDishes = [];
    if (topDishes) {
      parsedTopDishes = JSON.parse(topDishes);
    }

    const dishImages = req.files?.dishImage || [];
    for (let i = 0; i < parsedTopDishes.length; i++) {
      if (dishImages[i]) {
        const url = await uploadToCloudinary(
          dishImages[i].buffer,
          "top_dishes"
        );
        parsedTopDishes[i].image = url;
      }
    }

    // Save hotel in DB
    const hotel = new Hotel({
      hotelName,
      hotelAddress,
      hotelCity,
      hotelState,
      hotelZipCode,
      hotelDescription,
      rentPerDay,
      hotelImage: hotelImageUrl,
      topDishes: parsedTopDishes,
    });

    await hotel.save();

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: hotel,
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create hotel",
      error: error.message,
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
  getHotelMenu,
  getTopDishes,
  uploadTopDishes
};
