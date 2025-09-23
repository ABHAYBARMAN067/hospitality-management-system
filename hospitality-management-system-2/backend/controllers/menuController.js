const express = require('express');
const MenuItem = require('../models/MenuItem');
const { uploadSingle, handleUploadError } = require('../middlewares/fileUpload');

const router = express.Router();

// Get all menu items for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new menu item
router.post('/', uploadSingle, handleUploadError, async (req, res) => {
  try {
    const { name, description, price, category, restaurantId, isAvailable } = req.body;

    const menuItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      category,
      restaurantId,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image: req.file ? req.file.path : null
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item
router.put('/:id', uploadSingle, handleUploadError, async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Update fields
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = parseFloat(price);
    if (category) menuItem.category = category;
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;
    if (req.file) menuItem.image = req.file.path;

    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle availability
router.patch('/:id/toggle-availability', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
