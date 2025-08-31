import React, { useState } from 'react';

const HotelDetails = ({ hotel, onBack, onTableSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Mock available tables data
  const availableTables = [
    { id: 1, name: "Table 1", capacity: 2, price: hotel.price, status: "available" },
    { id: 2, name: "Table 2", capacity: 4, price: hotel.price, status: "available" },
    { id: 3, name: "Table 3", capacity: 6, price: hotel.price, status: "available" },
    { id: 4, name: "Table 4", capacity: 8, price: hotel.price, status: "available" },
  ];

  const handleTableSelect = (table) => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time first');
      return;
    }
    onTableSelect({ ...table, date: selectedDate, time: selectedTime });
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-red-600 hover:text-red-700"
      >
        ← Back to Hotels
      </button>

      {/* Hotel Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <img src={hotel.image} alt={hotel.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
              <p className="text-gray-600 mb-2">{hotel.address}</p>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  ⭐ {hotel.rating} Rating
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">₹{hotel.price}</p>
              <p className="text-gray-500">per table</p>
            </div>
          </div>

          {/* Top Dishes */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Top Dishes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hotel.topDishes.map((dish, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="font-medium text-gray-800">{dish}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Book Your Table</h2>
        
        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
            >
              <option value="">Choose time</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
            </select>
          </div>
        </div>

        {/* Available Tables */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Tables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableTables.map((table) => (
              <div 
                key={table.id}
                className="border-2 border-gray-200 rounded-lg p-4 text-center hover:border-red-300 cursor-pointer transition-colors"
                onClick={() => handleTableSelect(table)}
              >
                <h4 className="font-semibold text-gray-800 mb-2">{table.name}</h4>
                <p className="text-gray-600 mb-2">Capacity: {table.capacity} people</p>
                <p className="text-red-600 font-bold">₹{table.price}</p>
                <div className="mt-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails; 