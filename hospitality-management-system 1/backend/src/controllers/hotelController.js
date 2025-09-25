import Hotel from "../models/Hotel.js";
import cloudinary, { uploadImage } from "../config/cloudinary.js";

// Create hotel
export const createHotel = async (req, res) => {
  try {
    const { name, city, address } = req.body;

    // Parse topDishes from the form data
    const topDishes = [];
    const dishImages = [];

    // Debug: log received file fields
    const fileKeys = Object.keys(req.files || {});
    if (fileKeys.length) {
      console.log("Received dish image fields:", fileKeys);
    }

    // Extract dish names and images (keep indices aligned 0..2)
    for (let i = 0; i < 3; i++) {
      const nameKeyArray = `topDishes[${i}][name]`;
      const dishName = req.body[nameKeyArray] || "";
      topDishes.push(dishName);

      const dishImageFile = req.files?.[`dishImage${i}`]?.[0];
      if (dishImageFile) {
        const uploaded = await uploadImage(dishImageFile, 'restaurant-tables/dishes');
        dishImages.push(uploaded.url);
      } else {
        dishImages.push("");
      }
    }

    // Hotel image upload
    let imageUrl = "";
    if (req.files.hotelImage && req.files.hotelImage[0]) {
      const uploaded = await uploadImage(req.files.hotelImage[0], 'restaurant-tables/hotels');
      imageUrl = uploaded.url;
    }

    const hotel = await Hotel.create({
      name,
      city,
      address,
      rating: 4.0, // Default rating
      price: 0, // Default price - can be updated later
      topDishes: topDishes.filter((_, idx) => topDishes[idx] !== ""),
      dishImages: dishImages.filter((_, idx) => topDishes[idx] !== ""),
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

    // Build update payload dynamically
    const updatePayload = {};
    if (name) updatePayload.name = name;
    if (city) updatePayload.city = city;
    if (address) updatePayload.address = address;
    if (price !== undefined) updatePayload.price = price;

    // Handle optional hotel image update
    if (req.files?.hotelImage?.[0]) {
      const uploaded = await uploadImage(req.files.hotelImage[0], 'restaurant-tables/hotels');
      updatePayload.image = uploaded.url;
    }

    // Handle optional top dishes and their images
    const updatedTopDishes = [];
    const updatedDishImages = [];
    for (let i = 0; i < 3; i++) {
      const dishName = req.body[`topDishes[${i}][name]`];
      const dishImageFile = req.files?.[`dishImage${i}`]?.[0];
      if (dishName || dishImageFile) {
        // Only push when at least name or image provided
        if (dishName) updatedTopDishes.push(dishName);
        if (dishImageFile) {
          const uploaded = await uploadImage(dishImageFile, 'restaurant-tables/dishes');
          updatedDishImages.push(uploaded.url);
        } else {
          updatedDishImages.push("");
        }
      }
    }
    if (updatedTopDishes.length > 0) updatePayload.topDishes = updatedTopDishes;
    if (updatedDishImages.length > 0) updatePayload.dishImages = updatedDishImages;

    const hotel = await Hotel.findByIdAndUpdate(req.params.id, updatePayload, { new: true });

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
