import Hotel from "../models/Hotel.js";

// Get all hotels
export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
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

// Create hotel (admin only)
export const createHotel = async (req, res) => {
  try {
    const { name, address, image, topDishes } = req.body;
    const hotel = await Hotel.create({
      name,
      address,
      image,
      topDishes,
      admin: req.user._id,
    });
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
