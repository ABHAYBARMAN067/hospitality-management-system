import Table from "../models/Table.js";

// Create table
export const createTable = async (req, res) => {
  try {
    const { hotel, name, capacity, price } = req.body;
    const table = await Table.create({ hotel, name, capacity, price });
    res.status(201).json({
      success: true,
      data: table,
      message: "Table created successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get tables by hotel
export const getTablesByHotel = async (req, res) => {
  try {
    const tables = await Table.find({ hotel: req.params.hotelId });
    res.json({
      success: true,
      data: tables,
      message: "Tables fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update table
export const updateTable = async (req, res) => {
  try {
    const { name, capacity, price, status } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { name, capacity, price, status },
      { new: true }
    );
    
    if (!table) {
      return res.status(404).json({ 
        success: false,
        message: "Table not found" 
      });
    }
    
    res.json({
      success: true,
      data: table,
      message: "Table updated successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Delete table
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    
    if (!table) {
      return res.status(404).json({ 
        success: false,
        message: "Table not found" 
      });
    }
    
    res.json({
      success: true,
      message: "Table deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
