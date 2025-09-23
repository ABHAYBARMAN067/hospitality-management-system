const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const config = require('../config/database');

const restaurantOwnerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'owner') {
      return res.status(403).json({ error: 'Access denied. Owner role required.' });
    }

    // Check if user owns the restaurant
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant || !restaurant.ownerId || restaurant.ownerId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You do not own this restaurant.' });
    }

    req.user = user;
    req.restaurant = restaurant;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = restaurantOwnerAuth;
