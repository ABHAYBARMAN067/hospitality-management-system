const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const MenuItem = require('../models/MenuItem');
const cloudinary = require('../config/cloudinary');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Signup request body:', JSON.stringify(req.body, null, 2));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      console.log('Request headers:', req.headers);
      return res.status(400).json({
        success: false,
        message: 'Validation errors occurred',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, role, hotelName, hotelAddress, rentPerDay, topDishes } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    let user;
    let hotel;
    let menuItems = [];

    if (role === 'admin') {
      // Validate required admin fields
      if (!hotelName || !hotelAddress || !rentPerDay) {
        return res.status(400).json({
          success: false,
          message: 'Hotel name, address, and rent per day are required for admin registration'
        });
      }

      // Upload hotel image if provided
      let hotelImageUrl = '';
      if (req.files && req.files.hotelImage) {
        hotelImageUrl = await uploadToCloudinary(req.files.hotelImage[0].path, 'hotels');
      }

      // Create user first
      user = await User.create({
        name,
        email,
        password,
        phone,
        role: 'admin'
      });

      // Create hotel
      hotel = await Hotel.create({
        name: hotelName,
        address: {
          street: hotelAddress,
          city: 'City', // You might want to add city field to form
          state: 'State', // You might want to add state field to form
          zipCode: '12345', // You might want to add zipCode field to form
          country: 'USA'
        },
        images: hotelImageUrl ? [hotelImageUrl] : [],
        owner: user._id,
        isActive: true
      });

      // Create top dishes if provided
      if (topDishes && Array.isArray(topDishes)) {
        for (const dish of topDishes) {
          if (dish.name && dish.image) {
            try {
              // Upload dish image
              const dishImageUrl = await uploadToCloudinary(dish.image, 'dishes');

              const menuItem = await MenuItem.create({
                hotel: hotel._id,
                name: dish.name,
                description: `${dish.name} - Top dish`, // You might want to add description field
                category: 'Specials', // Default category
                price: 0, // You might want to add price field to form
                image: dishImageUrl,
                isAvailable: true,
                isActive: true
              });
              menuItems.push(menuItem);
            } catch (error) {
              console.error('Error creating menu item:', error);
              // Continue with other dishes even if one fails
            }
          }
        }
      }
    } else {
      // Create regular user
      user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'user'
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: role === 'admin' ? 'Admin registered successfully with hotel' : 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      ...(role === 'admin' && {
        hotel: {
          id: hotel._id,
          name: hotel.name,
          address: hotel.address
        },
        menuItems: menuItems.map(item => ({
          id: item._id,
          name: item.name,
          image: item.image
        }))
      })
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user info'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const allowedFields = ['name', 'phone'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  updateProfile
};
