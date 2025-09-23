import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './UI/LoadingSpinner';
import MenuManagement from './MenuManagement';
import Reports from './Reports';
import { FaCalendarAlt, FaShoppingCart, FaPlus, FaCheck, FaTimes, FaClock, FaUsers, FaDollarSign, FaUtensils, FaChartBar } from 'react-icons/fa';

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    contact: '',
    cuisineType: '',
    location: '',
    images: []
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchOrders(), fetchRestaurants()]);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    }
  };



  const handleBookingUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleOrderUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const handleRestaurantCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newRestaurant).forEach(key => {
        if (key === 'images') {
          newRestaurant.images.forEach(file => formData.append('images', file));
        } else {
          formData.append(key, newRestaurant[key]);
        }
      });
      await axios.post('http://localhost:5000/api/admin/restaurants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Restaurant created successfully!');
      fetchRestaurants();
      setNewRestaurant({ name: '', address: '', contact: '', cuisineType: '', location: '', images: [] });
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error('Failed to create restaurant');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage bookings, orders, and restaurants
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-600 text-2xl mr-4" />
            <div>
              <h3 className="text-2xl font-bold">{bookings.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Bookings</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <FaShoppingCart className="text-green-600 text-2xl mr-4" />
            <div>
              <h3 className="text-2xl font-bold">{orders.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <FaPlus className="text-purple-600 text-2xl mr-4" />
            <div>
              <h3 className="text-2xl font-bold">{restaurants.length}</h3>
              <p className="text-gray-600 dark:text-gray-300">Total Restaurants</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Manage Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          Manage Bookings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{booking.restaurantId?.name || 'Unknown Restaurant'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  👤 {booking.userId?.name || 'Unknown User'}
                </p>
                <p className="text-sm">📅 {booking.date}</p>
                <p className="text-sm">🕐 {booking.time}</p>
                <p className="text-sm">👥 {booking.seats} seats</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleBookingUpdate(booking._id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaCheck className="mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleBookingUpdate(booking._id, 'rejected')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaTimes className="mr-1" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Manage Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaShoppingCart className="mr-3 text-green-600" />
          Manage Orders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{order.restaurantId?.name || 'Unknown Restaurant'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  👤 {order.userId?.name || 'Unknown User'}
                </p>
                <p className="text-sm flex items-center">
                  <FaDollarSign className="mr-1" />
                  ${order.totalPrice}
                </p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleOrderUpdate(order._id, 'preparing')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaClock className="mr-1" />
                  Preparing
                </button>
                <button
                  onClick={() => handleOrderUpdate(order._id, 'delivered')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaCheck className="mr-1" />
                  Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Restaurant Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaPlus className="mr-3 text-purple-600" />
          Add New Restaurant
        </h2>

        <form onSubmit={handleRestaurantCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={newRestaurant.name}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={newRestaurant.address}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Contact Number"
            value={newRestaurant.contact}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, contact: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Cuisine Type"
            value={newRestaurant.cuisineType}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisineType: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newRestaurant.location}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />



          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewRestaurant({ ...newRestaurant, images: Array.from(e.target.files) })}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              Add Restaurant
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Admin;
