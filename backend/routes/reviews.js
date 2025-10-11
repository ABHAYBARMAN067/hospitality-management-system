import express from 'express';
import { createReview, getReviewsByRestaurant } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /reviews/:restaurantId - create review for restaurant
router.post('/:restaurantId', verifyToken, createReview);

// GET /reviews/:restaurantId - get reviews for restaurant
router.get('/:restaurantId', getReviewsByRestaurant);

export default router;
