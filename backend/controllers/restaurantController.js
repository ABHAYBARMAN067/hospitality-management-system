import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ error: 'Not found' });

        // Fetch top menu items
        const topMenuItems = await MenuItem.find({ restaurantId: restaurant._id, isTop: true }).limit(4);

        res.json({
            ...restaurant.toObject(),
            topMenuItems
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add more CRUD functions as needed
