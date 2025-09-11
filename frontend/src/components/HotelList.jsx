import React, { useState, useEffect } from 'react';
import HotelCard from './HotelCard';
import { getHotelsByCity } from '../utils/api';

const HotelList = ({ city, onHotelSelect }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await getHotelsByCity(city);
        setHotels(response.data);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels');
        // Fallback to mock data if API fails
        setHotels([
          {
            _id: 1,
            name: "The Taj",
            city: city,
            address: "123 Marine Drive, " + city,
            price: 4500,
            image: "https://source.unsplash.com/400x300/?hotel,room",
            topDishes: ["Butter Chicken", "Biryani", "Tandoori Roti"],
            rating: 4.8
          },
          {
            _id: 2,
            name: "Oberoi Hotel",
            city: city,
            address: "456 Luxury Street, " + city,
            price: 6000,
            image: "https://source.unsplash.com/400x300/?resort,hotel",
            topDishes: ["Dal Makhani", "Paneer Tikka", "Naan"],
            rating: 4.6
          },
          {
            _id: 3,
            name: "Leela Palace",
            city: city,
            address: "789 Royal Avenue, " + city,
            price: 5500,
            image: "https://source.unsplash.com/400x300/?luxury,hotel",
            topDishes: ["Kebab", "Curry", "Rice"],
            rating: 4.7
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchHotels();
    }
  }, [city]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Showing sample hotels</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Hotels in {city}
        </h1>
        <p className="text-gray-600">
          {hotels.length} hotels found in {city}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard 
            key={hotel._id || hotel.id}
            hotel={hotel}
            onSelect={() => onHotelSelect(hotel)}
          />
        ))}
      </div>
    </div>
  );
};

export default HotelList; 