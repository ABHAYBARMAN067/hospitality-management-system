import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchReviews = async () => {
      // Mock data - replace with actual API call
      const mockReviews = [
        {
          id: 1,
          restaurantName: 'Spice Garden',
          restaurantId: '1',
          rating: 5,
          comment: 'Absolutely amazing food! The biryani was perfectly spiced and the service was excellent. Will definitely visit again!',
          date: '2024-01-15T14:30:00Z',
          helpful: 12,
          images: []
        },
        {
          id: 2,
          restaurantName: 'The Italian Corner',
          restaurantId: '2',
          rating: 4,
          comment: 'Great pasta and pizza. The ambiance is perfect for a romantic dinner. Only complaint is that it gets a bit noisy during peak hours.',
          date: '2024-01-10T19:45:00Z',
          helpful: 8,
          images: []
        },
        {
          id: 3,
          restaurantName: 'Burger Palace',
          restaurantId: '3',
          rating: 3,
          comment: 'Decent burgers but nothing extraordinary. The fries were good though. Service could be faster during lunch rush.',
          date: '2024-01-05T12:15:00Z',
          helpful: 3,
          images: []
        }
      ];

      setTimeout(() => {
        setReviews(mockReviews);
        setLoading(false);
      }, 1000);
    };

    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          My Reviews
        </h1>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              You haven't written any reviews yet. Share your dining experiences!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {review.restaurantName}
                    </h3>
                    <div className="flex items-center space-x-4 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{review.helpful} people found this helpful</span>
                  </div>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    View Restaurant →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics Section */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {reviews.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Reviews</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {reviews.reduce((sum, review) => sum + review.helpful, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Helpful Votes</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Reviews;
