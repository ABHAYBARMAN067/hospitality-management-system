import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchBookings = async () => {
      // Mock data - replace with actual API call
      const mockBookings = [
        {
          id: 1,
          restaurantName: 'Spice Garden',
          date: '2024-01-15',
          time: '19:00',
          guests: 4,
          status: 'confirmed',
          specialRequests: 'Window seat preferred'
        },
        {
          id: 2,
          restaurantName: 'The Italian Corner',
          date: '2024-01-20',
          time: '20:30',
          guests: 2,
          status: 'pending',
          specialRequests: 'Birthday celebration'
        }
      ];

      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              You haven't made any table bookings yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {booking.restaurantName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Date:</span> {booking.date}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {booking.time}
                      </div>
                      <div>
                        <span className="font-medium">Guests:</span> {booking.guests}
                      </div>
                    </div>
                    {booking.specialRequests && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Bookings;
