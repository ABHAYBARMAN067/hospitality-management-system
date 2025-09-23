import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './UI/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaUtensils, FaDollarSign } from 'react-icons/fa';

function MenuManagement({ restaurantId }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/menu/restaurant/${restaurantId}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('restaurantId', restaurantId);
      data.append('isAvailable', formData.isAvailable);

      if (editingItem) {
        await axios.put(`http://localhost:5000/api/menu/${editingItem._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Menu item updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/menu', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Menu item added successfully!');
      }

      fetchMenuItems();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/${id}`);
        toast.success('Menu item deleted successfully!');
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/menu/${id}/toggle-availability`);
      toast.success(`Menu item ${currentStatus ? 'disabled' : 'enabled'}`);
      fetchMenuItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update menu item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isAvailable: true
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Specials'];

  if (loading) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center">
          <FaUtensils className="mr-3 text-blue-600" />
          Menu Management
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center"
        >
          <FaPlus className="mr-2" />
          {showAddForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isAvailable">Available</label>
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white md:col-span-2"
              rows="3"
              required
            />

            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {item.image && (
              <div className="h-48 bg-gray-200 dark:bg-gray-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  item.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
              <p className="text-lg font-semibold text-blue-600 mb-2">
                <FaDollarSign className="inline mr-1" />
                {item.price}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Category: {item.category}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaEdit className="mr-1" />
                  Edit
                </button>

                <button
                  onClick={() => toggleAvailability(item._id, item.isAvailable)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    item.isAvailable
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {item.isAvailable ? <FaToggleOff /> : <FaToggleOn />}
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12">
          <FaUtensils className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No menu items yet</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start by adding your first menu item
          </p>
        </div>
      )}
    </div>
  );
}

export default MenuManagement;
