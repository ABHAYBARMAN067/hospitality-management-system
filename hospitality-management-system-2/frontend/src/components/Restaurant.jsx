import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './UI/LoadingSpinner';
import MenuManagement from './MenuManagement';
import ReviewForm from './ReviewForm';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaStar, FaCalendarAlt, FaShoppingCart, FaPlus, FaMinus, FaEdit, FaTrash } from 'react-icons/fa';

function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');
  const [booking, setBooking] = useState({ date: '', time: '', seats: 1 });
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine-in');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      setRestaurant(response.data.restaurant);
      setRatings(response.data.ratings);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        ...booking,
        restaurantId: id,
        userId: 'userId' // This should come from auth context
      });
      toast.success('Table booked successfully!');
      setBooking({ date: '', time: '', seats: 1 });
    } catch (error) {
      console.error('Error booking:', error);
      toast.error('Failed to book table');
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item._id !== itemId));
    } else {
      setCart(cart.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      toast.error('Please add items to your cart');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cart.map(item => ({ menuItemId: item._id, quantity: item.quantity })),
        totalPrice: getTotalPrice(),
        type: orderType,
        restaurantId: id,
        userId: 'userId' // This should come from auth context
      });
      toast.success('Order placed successfully!');
      setCart([]);
    } catch (error) {
      console.error('Error ordering:', error);
      toast.error('Failed to place order');
    }
  };

  const handleReviewSubmitted = async () => {
    // Refresh restaurant data to get updated ratings
    await fetchRestaurant();
  };

  if (loading) {
    return <LoadingSpinner size={60} />;
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
        <Link to="/restaurants" className="text-blue-600 hover:text-blue-700">
          ← Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <Link
          to="/restaurants"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Restaurants
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-6xl">🍽️</span>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaPhone className="mr-2" />
                  <span>{restaurant.contact}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg">🍽️ {restaurant.cuisineType}</p>
                <p className="text-lg">📍 {restaurant.location}</p>
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="text-lg">{restaurant.averageRating || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {['menu', 'booking', 'cart', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {activeTab === 'menu' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Menu</h2>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="dine-in">Dine-in</option>
                <option value="delivery">Delivery</option>
                <option value="takeaway">Takeaway</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.menu && restaurant.menu.length > 0 ? (
                restaurant.menu.map((item) => (
                  <div key={item._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-blue-600">${item.price}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No menu items available</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'booking' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Book a Table</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={booking.date}
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={booking.time}
                  onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of Seats</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={booking.seats}
                  onChange={(e) => setBooking({ ...booking, seats: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaCalendarAlt className="mr-2" />
                Book Table
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === 'cart' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Your Cart</h2>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-blue-600">${item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          <FaMinus />
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold mb-4">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Place Order ({orderType})
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center"
              >
                <FaStar className="mr-2" />
                Write Review
              </button>
            </div>

            {ratings.length === 0 ? (
              <div className="text-center py-8">
                <FaStar className="text-6xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No reviews yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to review this restaurant!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex text-yellow-500 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < rating.rating ? 'text-yellow-500' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(rating.date).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.userId && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          by {rating.userId.name || 'Anonymous'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{rating.review}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          restaurantId={id}
          onClose={() => setShowReviewForm(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}

export default Restaurant;
