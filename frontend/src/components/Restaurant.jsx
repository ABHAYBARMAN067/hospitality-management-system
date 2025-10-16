import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/solid';
import Navbar from './UI/Navbar';
import LoadingSpinner from './UI/LoadingSpinner';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Restaurant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const [restaurantRes, menuRes] = await Promise.all([
                    api.get(`/restaurants/${id}`),
                    api.get(`/restaurants/${id}/menu`)
                ]);
                setRestaurant(restaurantRes.data);
                setMenuItems(menuRes.data);
            } catch (err) {
                setRestaurantError(err.response?.data?.error || 'Failed to load restaurant');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
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
            toast.success('Table booked successfully!');
        } catch (error) {
            setBookingError(error.response?.data?.error || 'Failed to create booking');
            toast.error(error.response?.data?.error || 'Failed to create booking');
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
                        src={restaurant.imageUrl || ''}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end">
                        <div className="p-8 rounded-lg">
                            <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
                            <div className="flex items-center text-white space-x-4 mb-4">
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

                        {/* Menu Section */}
                        <div className="bg-primary-100 shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-primary-900 mb-4">Menu</h2>
                            {menuItems.length === 0 ? (
                                <p className="text-primary-500">Menu items will be loaded here...</p>
                            ) : (
                                <div className="space-y-4">
                                    {menuItems.map((item) => (
                                        <div key={item._id} className="flex items-center justify-between p-4 rounded-lg bg-primary-50 border border-primary-200">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image || `${item._id}`}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-primary-900">{item.name}</h3>
                                                    <p className="text-sm text-primary-600 font-medium">₹{item.price}</p>
                                                    {item.description && (
                                                        <p className="text-sm text-primary-500 mt-1">{item.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <button
                                                    onClick={() => {
                                                        const existingItem = cart.find(cartItem => cartItem.menuItemId === item._id);
                                                        if (existingItem) {
                                                            setCart(cart.map(cartItem =>
                                                                cartItem.menuItemId === item._id
                                                                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                                                    : cartItem
                                                            ));
                                                        } else {
                                                            setCart([...cart, {
                                                                menuItemId: item._id,
                                                                name: item.name,
                                                                price: item.price,
                                                                quantity: 1
                                                            }]);
                                                        }
                                                        toast.success('Item added to cart');
                                                    }}
                                                    className="px-6 py-2 bg-[#E03446] text-white rounded-lg hover:bg-[#BF238B] transition-colors font-medium"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-primary-100 shadow rounded-lg p-6 sticky top-8">
                            <div className="flex space-x-4 mb-4">
                                <button
                                    onClick={() => navigate('/my-table')}
                                    className="px-6 py-2 bg-[#E03446] text-white rounded-lg hover:bg-[#BF238B] transition-colors"
                                >
                                    Book Table
                                </button>
                            </div>

                            {/* Cart Section */}
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-primary-900 mb-4">Your Cart</h3>
                                {cart.length === 0 ? (
                                    <p className="text-primary-500">Your cart is empty</p>
                                ) : (
                                    <>
                                        <div className="space-y-2 mb-4">
                                            {cart.map((cartItem, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm font-medium text-primary-900">{cartItem.name}</p>
                                                        <p className="text-xs text-primary-500">₹{cartItem.price} x {cartItem.quantity}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => setCart(cart.map(item =>
                                                                item.menuItemId === cartItem.menuItemId
                                                                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                                                                    : item
                                                            ))}
                                                            className="px-2 py-1 bg-[#E03446] text-white rounded text-xs"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-sm">{cartItem.quantity}</span>
                                                        <button
                                                            onClick={() => setCart(cart.map(item =>
                                                                item.menuItemId === cartItem.menuItemId
                                                                    ? { ...item, quantity: item.quantity + 1 }
                                                                    : item
                                                            ))}
                                                            className="px-2 py-1 bg-[#E03446] text-white rounded text-xs"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => setCart(cart.filter(item => item.menuItemId !== cartItem.menuItemId))}
                                                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-4">
                                            <p className="text-lg font-semibold text-primary-900">
                                                Total: ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                                            </p>
                                            <button
                                                onClick={() => navigate('/cart', { state: { cart, restaurantId: id, restaurantName: restaurant.name } })}
                                                className="mt-4 w-full px-4 py-2 bg-[#E03446] text-white rounded-lg hover:bg-[#BF238B] transition-colors"
                                            >
                                                Proceed to Checkout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {!user ? (
                                <div className="text-center">
                                    {/* No login/signup buttons here */}
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
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E03446] hover:bg-[#BF238B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E03446] disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        className="px-4 py-2 bg-[#E03446] text-white rounded-md hover:bg-[#BF238B]"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>


        </div >
    );
};

export default Restaurant;
