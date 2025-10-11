import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/solid';
import Navbar from './UI/Navbar';
import LoadingSpinner from './UI/LoadingSpinner';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Restaurant = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [restaurantError, setRestaurantError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [guestCount, setGuestCount] = useState(2);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(null); // will hold booking object

    useEffect(() => {
        api.get(`/restaurants/${id}`)
            .then(res => {
                setRestaurant(res.data);
                setLoading(false);
            })
            .catch(err => {
                setRestaurantError(err.response?.data?.error || 'Failed to load restaurant');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        setBookingError('');

        // Validation
        if (!selectedDate || new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)) {
            setBookingError('Please select a future date.');
            setBookingLoading(false);
            return;
        }
        if (!selectedTime) {
            setBookingError('Please select a time.');
            setBookingLoading(false);
            return;
        }
        if (guestCount < 1) {
            setBookingError('Please select at least 1 guest.');
            setBookingLoading(false);
            return;
        }

        try {
            const res = await api.post('/bookings', {
                restaurantId: id,
                date: selectedDate,
                time: selectedTime,
                guests: guestCount,
            });
            setBookingSuccess(res.data.booking);
        } catch (error) {
            setBookingError(error.response?.data?.error || 'Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-50 flex justify-center items-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (restaurantError) {
        return (
            <div className="min-h-screen bg-primary-50 flex justify-center items-center">
                <div className="text-center">
                    <h3 className="mt-2 text-xl font-medium text-primary-900">Error loading restaurant</h3>
                    <p className="mt-1 text-primary-500">{restaurantError}</p>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-primary-50 flex justify-center items-center">
                <div className="text-center">
                    <h3 className="mt-2 text-xl font-medium text-primary-900">Restaurant not found</h3>
                    <p className="mt-1 text-primary-500">The restaurant you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50">
            <Navbar />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="relative h-96 rounded-xl overflow-hidden">
                    <img
                        src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
                            <div className="flex items-center text-white space-x-4">
                                {restaurant.rating && (
                                    <div className="flex items-center">
                                        <StarIcon className="h-5 w-5 text-yellow-400" />
                                        <span className="ml-1">{restaurant.rating}</span>
                                    </div>
                                )}
                                {restaurant.cuisine && (
                                    <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                                        {restaurant.cuisine.join(', ')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Details Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-primary-100 shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-primary-900 mb-4">Restaurant Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <MapPinIcon className="h-6 w-6 text-primary-400 mt-1" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-primary-900">Location</h3>
                                        <p className="text-sm text-primary-500">{restaurant.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <PhoneIcon className="h-6 w-6 text-primary-400 mt-1" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-primary-900">Contact</h3>
                                        <p className="text-sm text-primary-500">{restaurant.contact}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <ClockIcon className="h-6 w-6 text-primary-400 mt-1" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-primary-900">Hours</h3>
                                        <p className="text-sm text-primary-500">11:00 AM - 10:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Preview Section */}
                        <div className="bg-primary-100 shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-primary-900 mb-4">Popular Dishes</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Example menu items - replace with actual data */}
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex items-center space-x-4 p-4 rounded-lg bg-primary-50">
                                        <div className="h-16 w-16 rounded-lg overflow-hidden">
                                            <img
                                                src={`https://source.unsplash.com/featured/100x100?food-${item}`}
                                                alt="Dish"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-primary-900">Dish Name</h3>
                                            <p className="text-sm text-primary-500">₹299</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-primary-100 shadow rounded-lg p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-primary-900 mb-4">Make a Reservation</h2>
                            {!user ? (
                                <div className="text-center">
                                    <p className="text-primary-700 mb-4">Please log in to make a reservation.</p>
                                    <a href="/login" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                                        Login
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {bookingError && (
                                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                            {bookingError}
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-primary-700 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-primary-700 mb-1">
                                                Time
                                            </label>
                                            <select
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                                className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                                            >
                                                <option value="">Select time</option>
                                                <option value="12:00">12:00 PM</option>
                                                <option value="13:00">1:00 PM</option>
                                                <option value="14:00">2:00 PM</option>
                                                {/* Add more time slots */}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-primary-700 mb-1">
                                                Number of Guests
                                            </label>
                                            <select
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={bookingLoading}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {bookingLoading ? 'Reserving...' : 'Reserve Table'}
                                        </button>
                                    </form>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Success Modal */}
                        {bookingSuccess && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-primary-900 mb-4">Reservation Successful!</h2>
                                        <p className="text-primary-700 mb-4">Thank you for your reservation. We look forward to serving you!</p>
                                        <p className="text-sm text-primary-500 mb-2">Booking ID: {bookingSuccess._id}</p>
                                        <p className="text-sm text-primary-500 mb-6">Date: {selectedDate} | Time: {selectedTime} | Guests: {guestCount}</p>
                                        <button
                                            onClick={() => setBookingSuccess(null)}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
            </main>
        </div>
    );
};

export default Restaurant;
