import React, { useState, useEffect } from 'react';
import { getTablesByHotel } from '../utils/api';

const HotelDetails = ({ hotel, onBack, onTableSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await getTablesByHotel(hotel._id || hotel.id);
        // Check if we have data and it's in the correct format
        if (response?.data?.data) {
          setAvailableTables(response.data.data);
        } else {
          setError('No tables found');
          // Fallback to mock data
          setAvailableTables([
            { _id: 1, name: "Table 1", capacity: 2, price: hotel.price || 2000, status: "available" },
            { _id: 2, name: "Table 2", capacity: 4, price: hotel.price || 2000, status: "available" },
            { _id: 3, name: "Table 3", capacity: 6, price: hotel.price || 2000, status: "available" },
            { _id: 4, name: "Table 4", capacity: 8, price: hotel.price || 2000, status: "available" },
          ]);
        }
      } catch (err) {
        console.error('Error fetching tables:', err);
        setError('Failed to load tables');
        // Fallback to mock data
        setAvailableTables([
          { _id: 1, name: "Table 1", capacity: 2, price: hotel.price || 2000, status: "available" },
          { _id: 2, name: "Table 2", capacity: 4, price: hotel.price || 2000, status: "available" },
          { _id: 3, name: "Table 3", capacity: 6, price: hotel.price || 2000, status: "available" },
          { _id: 4, name: "Table 4", capacity: 8, price: hotel.price || 2000, status: "available" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (hotel) {
      fetchTables();
    }
  }, [hotel]);

  const validateDateTime = () => {
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      setError('Please select a future date');
      return false;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(selectedTime)) {
      setError('Please select a valid time (HH:MM format)');
      return false;
    }

    return true;
  };

  const handleTableSelect = (table) => {
    setError(null);

    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    if (!validateDateTime()) {
      return;
    }

    onTableSelect({
      ...table,
      date: selectedDate,
      time: selectedTime,
      tableName: table.name,
      capacity: table.capacity
    });
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
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading tables...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-gray-600">Showing sample tables</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableTables.map((table) => (
                <div
                  key={table._id || table.id}
                  className={`border-2 rounded-lg p-4 text-center transition-colors ${table.status === 'available'
                      ? 'border-gray-200 hover:border-red-300 cursor-pointer'
                      : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                    }`}
                  onClick={() => table.status === 'available' && handleTableSelect(table)}
                >
                  <h4 className="font-semibold text-gray-800 mb-2">{table.name}</h4>
                  <p className="text-gray-600 mb-2">Capacity: {table.capacity} people</p>
                  <p className="text-red-600 font-bold">₹{table.price}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${table.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {table.status === 'available' ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails; 