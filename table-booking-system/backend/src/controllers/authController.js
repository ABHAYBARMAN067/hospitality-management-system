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
    console.log(`Uploading file to Cloudinary: ${file.originalname || 'unknown file'}`);

    // Handle both file path and buffer
    let uploadOptions = { folder: folder, resource_type: 'auto' };

    if (file.path) {
      // File was saved to disk
      uploadOptions = { ...uploadOptions, ...{ path: file.path } };
      const result = await cloudinary.uploader.upload(file.path, uploadOptions);
      console.log(`Upload successful: ${result.secure_url}`);
      return result.secure_url;
    } else if (file.buffer) {
      // File is in memory buffer - convert to data URI
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
      console.log(`Upload successful: ${result.secure_url}`);
      return result.secure_url;
    } else {
      throw new Error('No valid file path or buffer found');
    }
  } catch (error) {
    console.error(`Image upload failed:`, error);
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
        message: 'Invalid input, please check your data',
        fields: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { name, email, password, phone, role, hotelName, hotelAddress, hotelCity, hotelState, hotelZipCode, hotelDescription, rentPerDay } = req.body;

    // Parse topDishes with improved error handling
    let topDishesData = [];
    if (req.body.topDishes) {
      try {
        if (typeof req.body.topDishes === 'string') {
          topDishesData = JSON.parse(req.body.topDishes);
        } else if (Array.isArray(req.body.topDishes)) {
          topDishesData = req.body.topDishes;
        }
        if (!Array.isArray(topDishesData)) {
          topDishesData = [];
        }
      } catch (err) {
        console.warn('Invalid topDishes format, ignoring and proceeding:', err);
        topDishesData = [];
      }
    }

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
        hotelImageUrl = await uploadToCloudinary(req.files.hotelImage[0], 'hotels');
      }

      // Create user first
      user = await User.create({
        name,
        email,
        password,
        phone,
        role: 'admin'
      });

      // Create address object from individual fields
      let addressObj = {
        street: hotelAddress || '',
        city: hotelCity || 'City',
        state: hotelState || 'State',
        zipCode: hotelZipCode || '12345',
        country: 'USA'
      };

      // Set default hotelDescription if empty string or not provided
      const hotelDesc = hotelDescription && hotelDescription.trim().length > 0
        ? hotelDescription
        : `${hotelName} - A premium hospitality destination offering exceptional service and comfort.`;

      // Create hotel with all required fields
      hotel = await Hotel.create({
        name: hotelName,
        description: hotelDesc,
        address: addressObj,
        email: email, // Use user's email as hotel email
        images: hotelImageUrl ? [hotelImageUrl] : [],
        owner: user._id,
        isActive: true
      });

      // Create top dishes if provided with improved error handling
      if (topDishesData && Array.isArray(topDishesData)) {
        console.log(`Creating ${topDishesData.length} top dishes for hotel: ${hotel.name}`);

        // Collect all dish images from various field names
        const dishImageFiles = [];
        if (req.files) {
          // Handle dishImage0, dishImage1, etc.
          for (let i = 0; i < 6; i++) {
            const fieldName = `dishImage${i}`;
            if (req.files[fieldName]) {
              dishImageFiles.push(req.files[fieldName][0]);
            }
          }
          // Handle generic dishImage field (multiple files)
          if (req.files.dishImage) {
            dishImageFiles.push(...req.files.dishImage);
          }
        }

        console.log(`Found ${dishImageFiles.length} dish image files to upload`);

        for (let i = 0; i < topDishesData.length; i++) {
          const dish = topDishesData[i];
          if (dish.name && dish.name.trim()) {
            try {
              let dishImageUrl = '';
              console.log(`Processing dish ${i + 1}: ${dish.name}`);

              // Upload dish image if available
              if (dishImageFiles[i]) {
                console.log(`Uploading image for dish: ${dish.name}`);
                dishImageUrl = await uploadToCloudinary(dishImageFiles[i], 'dishes');
                console.log(`Successfully uploaded image for ${dish.name}: ${dishImageUrl}`);
              } else {
                console.log(`No image file found for dish ${i + 1}: ${dish.name}`);
              }

              const menuItem = await MenuItem.create({
                hotel: hotel._id,
                name: dish.name.trim(),
                description: dish.description || `${dish.name} - Top dish`,
                category: dish.category || 'Specials',
                price: parseFloat(dish.price) || 0,
                image: dishImageUrl,
                isAvailable: true,
                isActive: true,
                isTopDish: true
              });

              menuItems.push(menuItem);
              console.log(`Successfully created menu item: ${dish.name}`);
            } catch (error) {
              console.error(`Error creating menu item "${dish.name}":`, error);
              // Continue with other dishes even if one fails
            }
          } else {
            console.log(`Skipping dish ${i + 1} - no name provided`);
          }
        }
      } else {
        console.log('No top dishes data provided or invalid format');
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
