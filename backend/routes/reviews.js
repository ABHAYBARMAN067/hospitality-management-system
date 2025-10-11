import express from 'express';
import { createReview, getReviewsByRestaurant } from '../controllers/reviewController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// POST /reviews/:restaurantId - create review for restaurant
router.post('/:restaurantId', auth, createReview);

// GET /reviews/:restaurantId - get reviews for restaurant
router.get('/:restaurantId', getReviewsByRestaurant);

export default router;
