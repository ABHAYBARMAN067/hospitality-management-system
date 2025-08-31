import React from 'react';
import HotelCard from './HotelCard';

const HotelList = ({ city, onHotelSelect }) => {
  // Mock data - in real app this would come from API
  const hotels = [
    {
      id: 1,
      name: "The Taj",
      location: city,
      address: "123 Marine Drive, " + city,
      price: "4500",
      image: "https://source.unsplash.com/400x300/?hotel,room",
      topDishes: ["Butter Chicken", "Biryani", "Tandoori Roti"],
      rating: 4.8
    },
    {
      id: 2,
      name: "Oberoi Hotel",
      location: city,
      address: "456 Luxury Street, " + city,
      price: "6000",
      image: "https://source.unsplash.com/400x300/?resort,hotel",
      topDishes: ["Dal Makhani", "Paneer Tikka", "Naan"],
      rating: 4.6
    },
    {
      id: 3,
      name: "Leela Palace",
      location: city,
      address: "789 Royal Avenue, " + city,
      price: "5500",
      image: "https://source.unsplash.com/400x300/?luxury,hotel",
      topDishes: ["Kebab", "Curry", "Rice"],
      rating: 4.7
    }
  ];

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
            key={hotel.id}
            hotel={hotel}
            onSelect={() => onHotelSelect(hotel)}
          />
        ))}
      </div>
    </div>
  );
};

export default HotelList; 