import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/solid';
import Navbar from './UI/Navbar';
import LoadingSpinner from './UI/LoadingSpinner';
import api from '../api/api.js';

const HotelsDetail = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [guestCount, setGuestCount] = useState(2);

    useEffect(() => {
        fetchRestaurant();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            const res = await api.get(`/restaurants/${id}`);
            setRestaurant(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching restaurant:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center" style={{backgroundColor: '#FFF5F6'}}>
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex justify-center items-center" style={{backgroundColor: '#FFF5F6'}}>
                <div className="text-center">
                    <h3 className="mt-2 text-xl font-medium" style={{color: '#4F191E'}}>Hotel not found</h3>
                    <p className="mt-1" style={{color: '#FF7B8B'}}>The hotel you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: '#FFF5F6'}}>
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
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hotel Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <MapPinIcon className="h-6 w-6 text-gray-400 mt-1" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Location</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{restaurant.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <PhoneIcon className="h-6 w-6 text-gray-400 mt-1" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{restaurant.contactNumber || restaurant.contact}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <ClockIcon className="h-6 w-6 text-gray-400 mt-1" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Hours</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">11:00 AM - 10:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Dishes Section */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Dishes</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {restaurant.topMenuItems && restaurant.topMenuItems.length > 0 ? (
                                    restaurant.topMenuItems.map((item) => (
                                        <div key={item._id} className="flex items-center space-x-4 p-4 rounded-lg" style={{backgroundColor: '#FFEDEF'}}>
                                            <div className="h-16 w-16 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.image || 'https://source.unsplash.com/featured/100x100?food'}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium" style={{color: '#4F191E'}}>{item.name}</h3>
                                                <p className="text-sm" style={{color: '#FF7B8B'}}>₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No top dishes available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Make a Reservation</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Time
                                    </label>
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    >
                                        <option value="">Select time</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">1:00 PM</option>
                                        <option value="14:00">2:00 PM</option>
                                        {/* Add more time slots */}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Number of Guests
                                    </label>
                                    <select
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Reserve Table
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HotelsDetail;
