import Hotel from "../models/Hotel.js";
import cloudinary from "../config/cloudinary.js";
import { v2 as cloudinaryUpload } from "cloudinary";

// Get all hotels
export const getHotels = async (req, res) => {
  try {
    const { city } = req.query;
    let query = { isActive: true };
    
    if (city) {
      query.city = city;
    }
    
    const hotels = await Hotel.find(query).populate('admin', 'name email');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hotels by city
export const getHotelsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const hotels = await Hotel.find({ city, isActive: true }).populate('admin', 'name email');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hotel by ID
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('admin', 'name email');
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create hotel (admin only)
export const createHotel = async (req, res) => {
  try {
    const { name, city, address, topDishes } = req.body;
    
    // Upload hotel image to Cloudinary
    let hotelImageUrl = '';
    if (req.files && req.files.hotelImage) {
      const result = await cloudinaryUpload.uploader.upload(req.files.hotelImage.tempFilePath, {
        folder: 'hotels',
        resource_type: 'image'
      });
      hotelImageUrl = result.secure_url;
    }

    // Upload dish images to Cloudinary
    const dishesWithImages = [];
    for (let i = 0; i < topDishes.length; i++) {
      const dish = topDishes[i];
      let dishImageUrl = '';
      
      if (req.files && req.files[`dishImage${i}`]) {
        const result = await cloudinaryUpload.uploader.upload(req.files[`dishImage${i}`].tempFilePath, {
          folder: 'dishes',
          resource_type: 'image'
        });
        dishImageUrl = result.secure_url;
      }
      
      dishesWithImages.push({
        name: dish.name,
        image: dishImageUrl
      });
    }

    const hotel = await Hotel.create({
      name,
      city,
      address,
      image: hotelImageUrl,
      topDishes: dishesWithImages,
      admin: req.user._id,
    });

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hotel (admin only)
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    
    // Check if user is the admin of this hotel
    if (hotel.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this hotel" });
    }

    const { name, city, address, topDishes } = req.body;
    
    // Update hotel image if new one is provided
    if (req.files && req.files.hotelImage) {
      const result = await cloudinaryUpload.uploader.upload(req.files.hotelImage.tempFilePath, {
        folder: 'hotels',
        resource_type: 'image'
      });
      hotel.image = result.secure_url;
    }

    // Update dish images if new ones are provided
    if (req.files) {
      for (let i = 0; i < topDishes.length; i++) {
        if (req.files[`dishImage${i}`]) {
          const result = await cloudinaryUpload.uploader.upload(req.files[`dishImage${i}`].tempFilePath, {
            folder: 'dishes',
            resource_type: 'image'
          });
          topDishes[i].image = result.secure_url;
        }
      }
    }

    hotel.name = name || hotel.name;
    hotel.city = city || hotel.city;
    hotel.address = address || hotel.address;
    hotel.topDishes = topDishes || hotel.topDishes;

    await hotel.save();
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete hotel (admin only)
export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    
    // Check if user is the admin of this hotel
    if (hotel.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this hotel" });
    }

    await Hotel.findByIdAndDelete(id);
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
