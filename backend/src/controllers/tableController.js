import Table from "../models/Table.js";

// Create table
export const createTable = async (req, res) => {
  try {
    const { hotel, name, capacity, price } = req.body;
    const table = await Table.create({ hotel, name, capacity, price });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tables by hotel
export const getTablesByHotel = async (req, res) => {
  try {
    const tables = await Table.find({ hotel: req.params.hotelId });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
