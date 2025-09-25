const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const { location, cuisineType, search } = req.query;
    let query = { isActive: true };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (cuisineType) {
      query.cuisineType = { $regex: cuisineType, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const restaurants = await Restaurant.find(query)
      .populate('ownerId', 'name email')
      .sort({ rating: -1 });

    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Get reviews for this restaurant
    const reviews = await Review.find({ restaurantId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      ...restaurant.toObject(),
      reviews,
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create restaurant
const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, location, contact, cuisineType } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const restaurant = new Restaurant({
      name,
      description,
      address,
      location,
      contact,
      cuisineType,
      images,
      ownerId: req.user.userId,
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Check if user is the owner
    if (restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updates = req.body;
    if (req.files) {
      updates.images = req.files.map(file => file.path);
    }

    Object.assign(restaurant, updates);
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Check if user is the owner
    if (restaurant.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await restaurant.remove();
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
