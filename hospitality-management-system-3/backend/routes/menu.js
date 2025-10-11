import express from 'express';
import {
    getMenuItemsByRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuController.js';

const router = express.Router();

// Get all menu items for a restaurant
router.get('/restaurant/:restaurantId', getMenuItemsByRestaurant);
// Add a menu item (owner only)
router.post('/', addMenuItem);
// Update a menu item (owner only)
router.put('/:id', updateMenuItem);
// Delete a menu item (owner only)
router.delete('/:id', deleteMenuItem);

export default router;
