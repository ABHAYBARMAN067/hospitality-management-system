import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    minRating: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchHotels();
  }, [filters]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const response = await axios.get(
        `http://localhost:5000/api/hotels?${queryParams.toString()}`
      );

      // Fix: Correctly access the hotels data from API response
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setHotels(response.data.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setHotels([]);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      minRating: '',
      maxPrice: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header - Mobile First Responsive */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Hotels
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing restaurants in your city
          </p>
        </div>

        {/* Filters - Mobile First Responsive */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Filter */}
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label htmlFor="minRating" className="block text-sm font-medium text-gray-700">
                Minimum Rating
              </label>
              <select
                id="minRating"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <select
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Any Price</option>
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="expensive">Expensive</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm sm:text-base min-h-[40px]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading hotels...</p>
            </div>
          </div>
        ) : hotels.length === 0 ? (
          /* No Results State */
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏨</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              No hotels found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
              Try adjusting your filters or search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Hotels Grid - Mobile First Responsive */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {hotels.map((hotel) => (
              <div
                key={hotel._id || hotel.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Hotel Image */}
                <div className="relative">
                  <img
                    src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                    alt={hotel.name}
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                    <div className="flex items-center text-sm font-semibold text-gray-900">
                      ⭐ {hotel.rating || 0}
                    </div>
                  </div>
                </div>

                {/* Hotel Information */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {hotel.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 text-sm sm:text-base flex items-center">
                      <span className="mr-2">📍</span>
                      {hotel.address?.city}, {hotel.address?.state}
                    </p>

                    <p className="text-gray-500 text-xs sm:text-sm">
                      {hotel.address?.street && `${hotel.address.street}, `}
                      {hotel.address?.city && `${hotel.address.city}, `}
                      {hotel.address?.state && `${hotel.address.state} `}
                      {hotel.address?.zipCode && hotel.address.zipCode}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 line-clamp-2">
                    {hotel.description?.substring(0, 120)}...
                  </p>

                  {/* Hotel Meta Information */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      💰 {hotel.priceRange}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({hotel.totalReviews || 0} reviews)
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/hotels/${hotel._id || hotel.id}`}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center min-h-[44px] text-sm sm:text-base"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
