import express from 'express';
import {
    getMenuItemsByRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuController.js';
import fileUpload from '../middlewares/fileUpload.js'; // Ensure default export is a function

const router = express.Router();

// Get all menu items for a restaurant
router.get('/restaurant/:restaurantId', getMenuItemsByRestaurant);

// Add a menu item (owner only) with file upload
router.post('/', fileUpload.single('image'), addMenuItem); 


router.put('/:id', fileUpload.single('image'), updateMenuItem);

// Delete a menu item (owner only)
router.delete('/:id', deleteMenuItem);

export default router;