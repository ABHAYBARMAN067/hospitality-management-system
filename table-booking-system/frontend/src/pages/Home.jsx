import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hotels?limit=3');

        // Fix: Correctly access the hotels data from API response
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setFeaturedHotels(response.data.data);
        } else {
          console.warn('Unexpected API response structure:', response.data);
          setFeaturedHotels([]);
        }
      } catch (error) {
        console.error('Error fetching featured hotels:', error);
        setFeaturedHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile First Responsive */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Book Your Perfect Table
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover amazing restaurants and reserve tables instantly
            </p>
            <Link
              to="/hotels"
              className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Browse Hotels
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section - Mobile First Responsive */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Hotels
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the finest dining experiences
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm sm:text-base">Loading featured hotels...</p>
              </div>
            </div>
          ) : featuredHotels.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No featured hotels available</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">Check back later for featured restaurants.</p>
                <Link
                  to="/hotels"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
                >
                  View All Hotels
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredHotels.map((hotel) => (
                <div
                  key={hotel._id || hotel.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                      alt={hotel.name}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        ⭐ {hotel.rating || 0}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {hotel.name}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-3 flex items-center">
                      📍 {hotel.address?.city}, {hotel.address?.state}
                    </p>
                    <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">
                      {hotel.description?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {hotel.totalReviews || 0} reviews
                      </div>
                      <Link
                        to={`/hotels/${hotel._id || hotel.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm min-h-[40px] flex items-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Mobile First Responsive */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose TableBooking?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the best restaurant booking platform with these amazing features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Instant Booking</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Book tables in real-time with instant confirmation
              </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Best Selection</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Choose from the finest restaurants in your city
              </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💳</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Secure Payments</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Safe and secure payment processing
              </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📱</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Easy Management</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Manage your bookings from anywhere
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
