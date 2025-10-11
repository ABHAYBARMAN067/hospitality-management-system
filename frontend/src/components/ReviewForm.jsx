import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import api from '../api/api.js';

const ReviewForm = ({ restaurantId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (!review.trim()) {
            setError('Please write a review');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post(`/reviews/${restaurantId}`, {
                rating,
                comment: review
            });
            setRating(0);
            setReview('');
            onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-primary-100 shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-medium leading-6 text-primary-900 mb-4">
                Leave a Review
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                        Rating
                    </label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <StarIcon
                                    className={`h-8 w-8 ${(hoverRating || rating) >= star
                                        ? 'text-yellow-400'
                                        : 'text-primary-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label htmlFor="review" className="block text-sm font-medium text-primary-700 mb-2">
                        Your Review
                    </label>
                    <textarea
                        id="review"
                        rows={4}
                        className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-primary-300 rounded-md bg-primary-100 text-primary-900"
                        placeholder="Tell us about your experience..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    {error && <p className="text-red-500 text-sm mr-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
