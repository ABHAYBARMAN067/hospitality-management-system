const express = require('express');
const Rating = require('../models/Rating');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// Get all ratings for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const ratings = await Rating.find({ restaurantId: req.params.restaurantId })
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rating by ID
router.get('/:id', async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id).populate('userId', 'name email');
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new rating
router.post('/', async (req, res) => {
  try {
    const { userId, restaurantId, rating, review } = req.body;

    // Check if user already rated this restaurant
    const existingRating = await Rating.findOne({ userId, restaurantId });
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this restaurant' });
    }

    const newRating = new Rating({
      userId,
      restaurantId,
      rating: parseInt(rating),
      review
    });

    await newRating.save();

    // Update restaurant average rating
    await updateRestaurantAverageRating(restaurantId);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update rating
router.put('/:id', async (req, res) => {
  try {
    const { rating, review } = req.body;
    const ratingDoc = await Rating.findById(req.params.id);

    if (!ratingDoc) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Update fields
    if (rating) ratingDoc.rating = parseInt(rating);
    if (review !== undefined) ratingDoc.review = review;

    await ratingDoc.save();

    // Update restaurant average rating
    await updateRestaurantAverageRating(ratingDoc.restaurantId);

    res.json(ratingDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete rating
router.delete('/:id', async (req, res) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.id);
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Update restaurant average rating
    await updateRestaurantAverageRating(rating.restaurantId);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's rating for a restaurant
router.get('/user/:userId/restaurant/:restaurantId', async (req, res) => {
  try {
    const rating = await Rating.findOne({
      userId: req.params.userId,
      restaurantId: req.params.restaurantId
    });
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to update restaurant average rating
async function updateRestaurantAverageRating(restaurantId) {
  try {
    const ratings = await Rating.find({ restaurantId });
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
      : 0;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      averageRating: Math.round(averageRating * 10) / 10
    });
  } catch (error) {
    console.error('Error updating restaurant average rating:', error);
  }
}

module.exports = router;
