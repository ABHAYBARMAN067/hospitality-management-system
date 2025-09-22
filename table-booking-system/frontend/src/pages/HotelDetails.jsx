import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);

      // Fix: Backend returns { success: true, data: hotel }
      // So we access response.data.data directly, not response.data.data.hotel
      if (response.data && response.data.success && response.data.data) {
        setHotel(response.data.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setHotel(null);
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading hotel details...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="error-container">
        <h2>Hotel not found</h2>
        <Link to="/hotels">Back to Hotels</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hotel Header - Mobile First Responsive */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Hotel Image */}
            <div className="relative">
              <img
                src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                alt={hotel.name}
                className="w-full h-64 sm:h-80 lg:h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded-full">
                <div className="flex items-center text-sm font-semibold text-gray-900">
                  ⭐ {hotel.rating || 0} <span className="text-gray-600 ml-1">({hotel.totalReviews || 0})</span>
                </div>
              </div>
            </div>

            {/* Hotel Information */}
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {hotel.name}
              </h1>

              {/* Hotel Meta Information */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start text-gray-700">
                  <span className="text-lg mr-3">📍</span>
                  <span className="text-sm sm:text-base">
                    {hotel.address?.street}, {hotel.address?.city}, {hotel.address?.state} {hotel.address?.zipCode}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-lg mr-3">💰</span>
                  <span className="text-sm sm:text-base font-medium">{hotel.priceRange}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-700">
                  <span className="text-lg mr-3">📞</span>
                  <span className="text-sm sm:text-base">{hotel.phone}</span>
                </div>
                {hotel.email && (
                  <div className="flex items-center text-gray-700">
                    <span className="text-lg mr-3">✉️</span>
                    <span className="text-sm sm:text-base">{hotel.email}</span>
                  </div>
                )}
                {hotel.website && (
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🌐</span>
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Operating Hours */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Operating Hours</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>🕐 Opening:</span>
                    <span>{hotel.operatingHours?.monday?.open || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🕐 Closing:</span>
                    <span>{hotel.operatingHours?.monday?.close || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <Link
                to="/bookings/new"
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl min-h-[48px] flex items-center justify-center"
              >
                Book a Table Now
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs - Mobile First Responsive */}
        <div className="bg-white rounded-xl shadow-lg mb-6 sm:mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-sm sm:text-base font-medium transition-colors min-h-[48px] ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-4 px-6 text-sm sm:text-base font-medium transition-colors min-h-[48px] ${
                activeTab === 'menu'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
            <button
              className={`flex-1 py-4 px-6 text-sm sm:text-base font-medium transition-colors min-h-[48px] ${
                activeTab === 'tables'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('tables')}
            >
              Tables
            </button>
          </div>
        </div>

        {/* Tab Content - Mobile First Responsive */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">About {hotel.name}</h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{hotel.description}</p>
              </div>

              <div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities && hotel.amenities.length > 0 ? (
                    hotel.amenities.map((amenity, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {amenity}
                      </span>
                    ))
                  ) : (
                    <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      No amenities specified
                    </span>
                  )}
                </div>
              </div>

              {hotel.cuisine && hotel.cuisine.length > 0 && (
                <div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Cuisine</h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.cuisine.map((cuisine, index) => (
                      <span key={index} className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Menu</h3>
              <MenuSection hotelId={hotel._id || hotel.id} />
            </div>
          )}

          {activeTab === 'tables' && (
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Available Tables</h3>
              <TablesSection hotelId={hotel._id || hotel.id} />
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

// Menu Section Component
const MenuSection = ({ hotelId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [menuResponse, topDishesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/hotels/${hotelId}/menu`),
          axios.get(`http://localhost:5000/api/hotels/${hotelId}/top-dishes`)
        ]);

        if (menuResponse.data && menuResponse.data.success && menuResponse.data.data) {
          setMenuItems(menuResponse.data.data);
        } else {
          console.warn('Unexpected menu API response:', menuResponse.data);
          setMenuItems([]);
        }

        if (topDishesResponse.data && topDishesResponse.data.success && topDishesResponse.data.data) {
          setTopDishes(topDishesResponse.data.data);
        } else {
          console.warn('Unexpected top dishes API response:', topDishesResponse.data);
          setTopDishes([]);
        }
      } catch (error) {
        console.error('Error fetching menu or top dishes:', error);
        setMenuItems([]);
        setTopDishes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [hotelId]);

  if (loading) return <div className="loading">Loading menu...</div>;

  if (menuItems.length === 0 && topDishes.length === 0) {
    return <div className="no-data">No menu items available.</div>;
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="space-y-8">
      {topDishes.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 border border-yellow-300">
          <h4 className="text-lg sm:text-xl font-bold text-yellow-900 mb-4 border-b border-yellow-300 pb-2">
            Top Dishes
          </h4>
          <div className="space-y-4">
            {topDishes.map(item => (
              <div key={item._id || item.id} className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <h5 className="text-base sm:text-lg font-semibold text-yellow-900 mb-2">{item.name}</h5>
                    <p className="text-yellow-800 text-sm sm:text-base leading-relaxed mb-3">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.isVegetarian && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🟢 Veg
                        </span>
                      )}
                      {item.isVegan && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🌱 Vegan
                        </span>
                      )}
                      {item.preparationTime && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ⏱️ {item.preparationTime} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-lg sm:text-xl font-bold text-yellow-900">₹{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {categories.map(category => (
        <div key={category} className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
          </h4>
          <div className="space-y-4">
            {menuItems
              .filter(item => item.category === category)
              .map(item => (
                <div key={item._id || item.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{item.name}</h5>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.isVegetarian && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            🟢 Veg
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            🌱 Vegan
                          </span>
                        )}
                        {item.preparationTime && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ⏱️ {item.preparationTime} min
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-lg sm:text-xl font-bold text-blue-600">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Tables Section Component
const TablesSection = ({ hotelId }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hotels/${hotelId}/tables/available`);

        // Fix: Backend returns { success: true, data: tables }
        // So we access response.data.data directly
        if (response.data && response.data.success && response.data.data) {
          setTables(response.data.data);
        } else {
          console.warn('Unexpected tables API response:', response.data);
          setTables([]);
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
        setTables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [hotelId]);

  if (loading) return <div className="loading">Loading tables...</div>;

  if (tables.length === 0) {
    return <div className="no-data">No tables available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {tables.map(table => (
        <div key={table._id || table.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="text-center mb-4">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Table {table.tableNumber}
            </h4>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">👥 Capacity:</span>
              <span className="font-semibold text-gray-900">{table.capacity} guests</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">📍 Location:</span>
              <span className="font-semibold text-gray-900 text-sm">{table.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">💰 Rent:</span>
              <span className="font-bold text-blue-600">₹{table.rentPerHour}/hour</span>
            </div>

            {table.description && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-700 text-sm leading-relaxed">{table.description}</p>
              </div>
            )}

            {table.amenities && table.amenities.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {table.amenities.map((amenity, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to={`/bookings/new?tableId=${table._id || table.id}`}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center min-h-[40px]"
            >
              Book Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelDetails;
