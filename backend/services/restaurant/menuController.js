import MenuItem from '../models/MenuItem.js';
import cloudinary from '../config/cloudinary.js';

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
        const menuData = {
            restaurantId: req.body.restaurantId,
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            isTop: req.body.isTop === 'true' || req.body.isTop === true,
        };
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (err, uploaded) => {
                        if (err) reject(err);
                        else resolve(uploaded);
                    }
                );
                stream.end(req.file.buffer);
            });
            menuData.image = result.secure_url;
        }
        const item = new MenuItem(menuData);
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            isTop: req.body.isTop === 'true' || req.body.isTop === true,
        };
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (err, uploaded) => {
                        if (err) reject(err);
                        else resolve(uploaded);
                    }
                );
                stream.end(req.file.buffer);
            });
            updateData.image = result.secure_url;
        }
        const item = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
