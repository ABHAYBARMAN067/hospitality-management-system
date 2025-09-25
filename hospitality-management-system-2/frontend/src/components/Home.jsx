import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [filters, setFilters] = useState({ location: '', rating: '' });
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [filters, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(response.data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (filters.location) {
      filtered = filtered.filter((r) =>
        r.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.rating) {
      filtered = filtered.filter((r) => r.averageRating >= parseFloat(filters.rating));
    }

    setFilteredRestaurants(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          name="rating"
          placeholder="Minimum Rating"
          min="0"
          max="5"
          step="0.1"
          value={filters.rating}
          onChange={handleFilterChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <Link
              to={`/restaurant/${restaurant._id}`}
              key={restaurant._id}
              className="block p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-1">{restaurant.location}</p>
              <p className="text-yellow-500 font-semibold">
                Rating: {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : 'N/A'}
              </p>
            </Link>
          ))
        ) : (
          <p>No restaurants found matching the filters.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
