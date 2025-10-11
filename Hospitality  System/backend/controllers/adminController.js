import Restaurant from '../models/Restaurant.js';
import TableBooking from '../models/TableBooking.js';
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
    const bookings = await TableBooking.find({ restaurantId: { $in: restaurantIds } }).populate('userId', 'name');
    const transformedBookings = bookings.map(b => ({
      _id: b._id,
      customerName: b.userId ? b.userId.name : 'Unknown',
      date: b.date,
      guests: b.seats,
      status: b.status === 'approved' ? 'Confirmed' : b.status === 'rejected' ? 'Rejected' : b.status
    }));
    res.json(transformedBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Confirmed', 'Rejected', etc.

    const booking = await TableBooking.findById(id).populate('restaurantId');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Check if admin owns the restaurant
    const restaurant = booking.restaurantId;
    if (!restaurant || restaurant.createdBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not authorized' });

    let mappedStatus = status;
    if (status === 'Confirmed') mappedStatus = 'approved';
    else if (status === 'Rejected') mappedStatus = 'rejected';

    booking.status = mappedStatus;
    await booking.save();

    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
