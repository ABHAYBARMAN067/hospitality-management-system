import Hotel from "../models/Hotel.js";
import cloudinary from "../config/cloudinary.js";

// Create hotel (Admin)
export const createHotel = async (req, res) => {
  try {
    const { name, city, address, rating, price, topDishes } = req.body;

    // Image upload
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const hotel = await Hotel.create({
      name,
      city,
      address,
      rating,
      price,
      topDishes: topDishes ? topDishes.split(",") : [],
      image: imageUrl,
    });

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hotels by city
export const getHotelsByCity = async (req, res) => {
  const { city } = req.params;
  try {
    const hotels = await Hotel.find({ city });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hotel by ID
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
