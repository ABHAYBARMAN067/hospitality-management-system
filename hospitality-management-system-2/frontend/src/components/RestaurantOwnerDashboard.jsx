import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './UI/LoadingSpinner';
import MenuManagement from './MenuManagement';
import {
  FaCalendarAlt,
  FaShoppingCart,
  FaUtensils,
  FaChartBar,
  FaDollarSign,
  FaUsers,
  FaPlus,
  FaCheck,
  FaTimes,
  FaClock,
  FaEye
} from 'react-icons/fa';

function RestaurantOwnerDashboard({ restaurantId, user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (restaurantId) {
      fetchDashboardData();
    }
  }, [restaurantId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchBookings(),
        fetchOrders(),
        fetchRestaurant(),
        fetchTodayReports()
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/restaurant/${restaurantId}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/restaurant/${restaurantId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
      setRestaurant(response.data.restaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant data');
    }
  };

  const fetchTodayReports = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:5000/api/reports/daily/${restaurantId}/${today}`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleBookingUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
      fetchTodayReports();
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
      fetchTodayReports();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
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

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FaChartBar },
    { id: 'bookings', name: 'Bookings', icon: FaCalendarAlt },
    { id: 'orders', name: 'Orders', icon: FaShoppingCart },
    { id: 'menu', name: 'Menu', icon: FaUtensils },
    { id: 'reports', name: 'Reports', icon: FaEye }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{restaurant?.name || 'Restaurant Dashboard'}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Restaurant Owner</p>
            <p className="text-sm text-gray-500">{restaurant?.address}</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-600 text-2xl mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">{reports?.bookings?.total || 0}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Today's Bookings</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <FaShoppingCart className="text-green-600 text-2xl mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">{reports?.orders?.total || 0}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Today's Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <FaDollarSign className="text-purple-600 text-2xl mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">${reports?.revenue || 0}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Today's Revenue</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <FaUsers className="text-orange-600 text-2xl mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">{restaurant?.menu?.length || 0}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Menu Items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaCalendarAlt className="mr-3 text-blue-600" />
              Recent Bookings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.slice(0, 6).map((booking) => (
                <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">{booking.userId?.name || 'Unknown User'}</p>
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
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaShoppingCart className="mr-3 text-green-600" />
              Recent Orders
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.slice(0, 6).map((order) => (
                <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="space-y-2 mb-4">
                    <p className="font-semibold">{order.userId?.name || 'Unknown User'}</p>
                    <p className="text-sm flex items-center">
                      <FaDollarSign className="mr-1" />
                      ${order.totalPrice}
                    </p>
                    <p className="text-sm">Type: {order.type}</p>
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
          </div>
        </motion.div>
      )}

      {activeTab === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            All Bookings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">{booking.userId?.name || 'Unknown User'}</p>
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
      )}

      {activeTab === 'orders' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaShoppingCart className="mr-3 text-green-600" />
            All Orders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="space-y-2 mb-4">
                  <p className="font-semibold">{order.userId?.name || 'Unknown User'}</p>
                  <p className="text-sm flex items-center">
                    <FaDollarSign className="mr-1" />
                    ${order.totalPrice}
                  </p>
                  <p className="text-sm">Type: {order.type}</p>
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
      )}

      {activeTab === 'menu' && (
        <MenuManagement restaurantId={restaurantId} />
      )}

      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaChartBar className="mr-3 text-purple-600" />
              Reports & Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Today's Bookings</h3>
                <p className="text-3xl font-bold text-blue-600">{reports?.bookings?.total || 0}</p>
                <div className="text-sm text-gray-600 mt-2">
                  <p>Approved: {reports?.bookings?.approved || 0}</p>
                  <p>Pending: {reports?.bookings?.pending || 0}</p>
                  <p>Rejected: {reports?.bookings?.rejected || 0}</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Today's Orders</h3>
                <p className="text-3xl font-bold text-green-600">{reports?.orders?.total || 0}</p>
                <div className="text-sm text-gray-600 mt-2">
                  <p>Pending: {reports?.orders?.pending || 0}</p>
                  <p>Preparing: {reports?.orders?.preparing || 0}</p>
                  <p>Delivered: {reports?.orders?.delivered || 0}</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Today's Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">${reports?.revenue || 0}</p>
                <p className="text-sm text-gray-600 mt-2">Total earnings</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RestaurantOwnerDashboard;
