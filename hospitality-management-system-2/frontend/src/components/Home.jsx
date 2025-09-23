import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from './UI/LoadingSpinner';
import { RestaurantCardSkeleton } from './UI/SkeletonLoader';
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ cuisine: '', location: '', rating: '' });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/restaurants', { params: filters });
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ cuisine: '', location: '', rating: '' });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🍽️ DineHub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Discover amazing restaurants and book your perfect dining experience
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center mb-4">
          <FaFilter className="text-blue-600 mr-2" />
          <h2 className="text-2xl font-semibold">Find Your Perfect Restaurant</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaUtensils className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="cuisine"
              placeholder="Cuisine Type"
              value={filters.cuisine}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <FaStar className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              name="rating"
              placeholder="Min Rating"
              min="1"
              max="5"
              value={filters.rating}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={fetchRestaurants}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>

      {/* Restaurant Listings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-6">
          {restaurants.length > 0 ? `${restaurants.length} Restaurants Found` : 'Restaurants'}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-4xl">🍽️</span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaUtensils className="mr-2" />
                      <span>{restaurant.cuisineType}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaStar className="mr-2 text-yellow-500" />
                      <span>{restaurant.averageRating || 'N/A'}</span>
                    </div>
                  </div>

                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search filters or browse all restaurants
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Home;
