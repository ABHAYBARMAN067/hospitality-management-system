import Table from "../models/Table.js";

// Get tables for a hotel
export const getTables = async (req, res) => {
  try {
    const tables = await Table.find({ hotel: req.params.hotelId });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create table (admin only)
export const createTable = async (req, res) => {
  try {
    const { hotel, name, seats } = req.body;
    const table = await Table.create({ hotel, name, seats });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update table availability (admin only)
export const updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });

    table.isAvailable = req.body.isAvailable;
    await table.save();
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
