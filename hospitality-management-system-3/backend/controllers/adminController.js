import Restaurant from '../models/Restaurant.js';
import Booking from '../models/Booking.js';
import cloudinary from '../config/cloudinary.js'; // Agar restaurant add me image upload use kar rahe ho

// ✅ Add Restaurant
export const addRestaurant = async (req, res) => {
  try {
    const { name, address, contactNumber, email } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Image required' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (err, uploaded) => {
          if (err) reject(err);
          else resolve(uploaded);
        }
      );
      stream.end(req.file.buffer);
    });

    const restaurant = await Restaurant.create({
      name,
      address,
      contactNumber,
      email,
      imageUrl: result.secure_url,
      createdBy: req.user.id
    });

    res.status(201).json({ message: 'Restaurant added', restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get admin's restaurants
export const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ createdBy: req.user.id });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get bookings for admin's restaurants
export const getBookings = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ createdBy: req.user.id });
    const restaurantIds = restaurants.map(r => r._id);
    const bookings = await Booking.find({ restaurant: { $in: restaurantIds } });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed', 'cancelled', etc.

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Check if admin owns the restaurant
    const restaurant = await Restaurant.findById(booking.restaurant);
    if (!restaurant || restaurant.createdBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    booking.status = status;
    await booking.save();

    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
