import Hotel from "../models/Hotel.js";
import cloudinary from "../config/cloudinary.js";

// Create hotel
export const createHotel = async (req, res) => {
  try {
    const { name, city, address } = req.body;

    // Parse topDishes from the form data
    const topDishes = [];
    const dishImages = [];

    // Extract dish names and images
    for (let i = 0; i < 3; i++) {
      const dishName = req.body[`topDishes[${i}][name]`];
      if (dishName) {
        topDishes.push(dishName);

        // Handle dish image upload
        const dishImageFile = req.files[`dishImage${i}`]?.[0];
        if (dishImageFile) {
          const dishImageResult = await cloudinary.uploader.upload(dishImageFile.path);
          dishImages.push(dishImageResult.secure_url);
        } else {
          dishImages.push("");
        }
      }
    }

    // Hotel image upload
    let imageUrl = "";
    if (req.files.hotelImage && req.files.hotelImage[0]) {
      const result = await cloudinary.uploader.upload(req.files.hotelImage[0].path);
      imageUrl = result.secure_url;
    }

    const hotel = await Hotel.create({
      name,
      city,
      address,
      rating: 4.0, // Default rating
      price: 0, // Default price - can be updated later
      topDishes,
      dishImages,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: hotel,
      message: "Hotel created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get hotels by city
export const getHotelsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      res.status(400).json({
        success: false,
        message: "City parameter is required"
      });
      return;
    }

    // Case-insensitive search for city
    const hotels = await Hotel.find({
      city: { $regex: new RegExp(city, 'i') }
    });

    res.json({
      success: true,
      data: hotels,
      message: `Hotels in ${city} fetched successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get hotel by ID
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    res.json({
      success: true,
      data: hotel,
      message: "Hotel details fetched successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update hotel
export const updateHotel = async (req, res) => {
  try {
    const { name, city, address, price } = req.body;
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { name, city, address, price },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    res.json({
      success: true,
      data: hotel,
      message: "Hotel updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete hotel
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found"
      });
    }

    res.json({
      success: true,
      message: "Hotel deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
