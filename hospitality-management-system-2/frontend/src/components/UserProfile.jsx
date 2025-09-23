import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './UI/LoadingSpinner';
import { FaCalendarAlt, FaShoppingCart, FaHeart, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view your profile');
        return;
      }

      // Fetch user profile first to get user ID
      const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = userResponse.data;
      setUser(userData);

      // Fetch booking history
      const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings/user/${userData._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookingsResponse.data);

      // Fetch order history
      const ordersResponse = await axios.get(`http://localhost:5000/api/orders/user/${userData._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(ordersResponse.data);

      // Note: Favorites endpoint doesn't exist yet, so we'll skip this for now
      setFavorites([]);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner size={60} />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-600">You need to be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm sm:text-base">{user.email}</p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <FaCalendarAlt className="mr-1" />
                Joined {formatDate(user.createdAt)}
              </span>
              <span className={`px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1 sm:gap-0 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { id: 'profile', label: 'Profile', icon: FaEnvelope },
          { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
          { id: 'orders', label: 'Orders', icon: FaShoppingCart },
          { id: 'favorites', label: 'Favorites', icon: FaHeart }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-colors text-xs sm:text-sm ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
          >
            <tab.icon className="mr-1 sm:mr-2 text-sm sm:text-base" />
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 break-words">{user.name}</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 break-words">{user.email}</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 break-words">{user.phone || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <p className="text-base sm:text-lg text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Booking History</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center py-8">No bookings found</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg break-words">{booking.restaurantId?.name || 'Unknown Restaurant'}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{booking.restaurantId?.cuisineType}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                        <p className="text-gray-900 dark:text-gray-100">{formatDate(booking.date)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
                        <p className="text-gray-900 dark:text-gray-100">{booking.time}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Guests:</span>
                        <p className="text-gray-900 dark:text-gray-100">{booking.seats}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Booked:</span>
                        <p className="text-gray-900 dark:text-gray-100">{formatDate(booking.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center py-8">No orders found</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg break-words">{order.restaurantId?.name || 'Unknown Restaurant'}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{order.items?.length || 0} items</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
                        <p className="text-gray-900 dark:text-gray-100">${order.totalPrice}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Ordered:</span>
                        <p className="text-gray-900 dark:text-gray-100">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Items:</span>
                        <p className="text-gray-900 dark:text-gray-100">{order.items?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Favorite Restaurants</h2>
            {favorites.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center py-8">No favorite restaurants yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {favorites.map((restaurant) => (
                  <div key={restaurant._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 sm:mb-4 overflow-hidden">
                      {restaurant.images && restaurant.images[0] ? (
                        <img
                          src={restaurant.images[0]}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 break-words">{restaurant.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">{restaurant.cuisineType}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-2 sm:mb-3">
                      <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                      <span className="truncate">{restaurant.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-yellow-500">
                      <FaStar className="mr-1 flex-shrink-0" />
                      <span>{restaurant.averageRating || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserProfile;
