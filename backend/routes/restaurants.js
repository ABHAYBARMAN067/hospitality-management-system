// backend/routes/restaurants.js
import express from 'express';
import { getAllRestaurants, getRestaurantById } from '../controllers/restaurantController.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

export default router;
