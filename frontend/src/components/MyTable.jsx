import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Navbar from './UI/Navbar';

const MyTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Table Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-[#EF4F5F] to-[#E03446] text-white">
              <tr>
                <th className="py-3 px-6 text-left font-semibold">Date</th>
                <th className="py-3 px-6 text-left font-semibold">Time</th>
                <th className="py-3 px-6 text-left font-semibold">Guests</th>
                <th className="py-3 px-6 text-left font-semibold">Status</th>
                <th className="py-3 px-6 text-left font-semibold">Restaurant</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="py-3 px-6 border-b border-gray-200">{booking.date}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{booking.time}</td>
                  <td className="py-3 px-6 border-b border-gray-200">{booking.seats}</td>
                  <td className="py-3 px-6 border-b border-gray-200">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                      booking.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200">{booking.restaurantId?.name || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </>
  );
};

export default MyTable;
