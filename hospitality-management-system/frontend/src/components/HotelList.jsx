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
        // Check if we have data and it's in the correct format
        if (response?.data?.data) {
          setHotels(response.data.data);
        } else {
          // Fallback data if no hotels found
          setHotels([]);
          setError('No hotels found');
        }
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels');
        
        // Set empty array for hotels to prevent map error
        setHotels([]);
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