import MenuItem from '../models/MenuItem.js';

export const getMenuItemsByRestaurant = async (req, res) => {
    try {
        const items = await MenuItem.find({ restaurantId: req.params.restaurantId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const item = new MenuItem(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
