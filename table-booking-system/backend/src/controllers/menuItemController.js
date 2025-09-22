const MenuItem = require('../models/MenuItem');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Get all menu items for a hotel
// @route   GET /api/hotels/:hotelId/menu-items
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {
      hotel: req.params.hotelId,
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
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting menu items'
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/hotels/:hotelId/menu-items/:id
// @access  Public
const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('hotel', 'name');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting menu item'
    });
  }
};

// @desc    Create new menu item
// @route   POST /api/hotels/:hotelId/menu-items
// @access  Private (Hotel Owner or Admin)
const createMenuItem = async (req, res) => {
  try {
    // Add hotel to req.body
    req.body.hotel = req.params.hotelId;

    // Check if hotel owner or admin
    const Hotel = require('../models/Hotel');
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create menu items for this hotel'
      });
    }

    // Handle image upload to Cloudinary if file exists
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'dish-images',
          transformation: [{ width: 800, height: 600, crop: 'limit' }]
        });

        req.body.image = result.secure_url;

        // Delete local file after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed'
        });
      }
    }

    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Menu item with this information already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating menu item'
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/hotels/:hotelId/menu-items/:id
// @access  Private (Hotel Owner or Admin)
const updateMenuItem = async (req, res) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Check ownership or admin
    const Hotel = require('../models/Hotel');
    const hotel = await Hotel.findById(menuItem.hotel);

    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this menu item'
      });
    }

    // Handle image upload to Cloudinary if new file exists
    if (req.file) {
      try {
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'dish-images',
          transformation: [{ width: 800, height: 600, crop: 'limit' }]
        });

        req.body.image = result.secure_url;

        // Delete local file after upload
        fs.unlinkSync(req.file.path);

        // Delete old image from Cloudinary if it exists
        if (menuItem.image) {
          const publicId = menuItem.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`dish-images/${publicId}`);
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Image upload failed'
        });
      }
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating menu item'
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/hotels/:hotelId/menu-items/:id
// @access  Private (Hotel Owner or Admin)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Check ownership or admin
    const Hotel = require('../models/Hotel');
    const hotel = await Hotel.findById(menuItem.hotel);

    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this menu item'
      });
    }

    // Delete image from Cloudinary if it exists
    if (menuItem.image) {
      try {
        const publicId = menuItem.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`dish-images/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with deletion even if Cloudinary delete fails
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting menu item'
    });
  }
};

// @desc    Update top dish status
// @route   PUT /api/hotels/:hotelId/menu-items/:id/top-dish
// @access  Private (Hotel Owner or Admin)
const updateTopDishStatus = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Check ownership or admin
    const Hotel = require('../models/Hotel');
    const hotel = await Hotel.findById(menuItem.hotel);

    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this menu item'
      });
    }

    const { isTopDish } = req.body;

    // If setting as top dish, ensure no more than 3 top dishes per hotel
    if (isTopDish) {
      const topDishCount = await MenuItem.countDocuments({
        hotel: menuItem.hotel,
        isTopDish: true,
        _id: { $ne: menuItem._id }
      });

      if (topDishCount >= 3) {
        return res.status(400).json({
          success: false,
          message: 'Cannot have more than 3 top dishes per hotel'
        });
      }
    }

    menuItem.isTopDish = isTopDish;
    await menuItem.save();

    res.json({
      success: true,
      message: `Menu item ${isTopDish ? 'added to' : 'removed from'} top dishes`,
      data: menuItem
    });
  } catch (error) {
    console.error('Update top dish status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating top dish status'
    });
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateTopDishStatus
};
