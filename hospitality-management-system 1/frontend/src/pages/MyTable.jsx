import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserBookings } from "../utils/api";

const MyTable = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBookings();
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
        // Fallback to mock data
        setBookings([
          { _id: 1, hotel: { name: "The Taj" }, date: "2025-09-01", status: "confirmed", time: "19:00", price: 4500 },
          { _id: 2, hotel: { name: "Oberoi Hotel" }, date: "2025-09-05", status: "pending", time: "20:00", price: 6000 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Table Bookings</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user.name || user.email}!</p>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">{error}</p>
          <p className="text-yellow-600 text-sm">Showing sample bookings</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
          <p className="text-gray-500 mb-6">Start exploring restaurants and book your first table!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id || booking.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {booking.hotel?.name || booking.hotel}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Date:</span> {booking.date}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {booking.time || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ₹{booking.price || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${
                      booking.status === "confirmed" 
                        ? "bg-green-500" 
                        : booking.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTable;
