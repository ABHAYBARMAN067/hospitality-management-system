import React, { useState } from 'react';

const CitySelection = ({ onCitySelect }) => {
  const [selectedCity, setSelectedCity] = useState('');
  
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
  ];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    onCitySelect(city);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Select Your City
      </h1>
      <p className="text-center mb-8 text-gray-600">
        Choose a city to find the best hotels and restaurants
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
              selectedCity === city
                ? 'border-red-600 bg-red-50 text-red-600'
                : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <div className="text-lg font-semibold">{city}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitySelection; 