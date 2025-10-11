import Restaurant from '../models/Restaurant.js';

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
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add more CRUD functions as needed
