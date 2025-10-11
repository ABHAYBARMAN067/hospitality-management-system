import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import toast from 'react-hot-toast';
import Navbar from './UI/Navbar';
import SkeletonLoader from './UI/SkeletonLoader';
import api from '../api/api';

const Home = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ cuisine: '', location: '', rating: '' });

    // Booking modal state
    const [bookingModal, setBookingModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [bookingForm, setBookingForm] = useState({
        customerName: '',
        date: '',
        time: '',
        guests: 1
    });

    useEffect(() => {
        api.get('/restaurants')
            .then(res => {
                setRestaurants(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = restaurants.filter(r =>
        (!search || r.name.toLowerCase().includes(search.toLowerCase())) &&
        (!filter.cuisine || r.cuisine?.includes(filter.cuisine)) &&
        (!filter.location || r.location === filter.location) &&
        (!filter.rating || r.rating >= Number(filter.rating))
    );

    const openBookingModal = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setBookingModal(true);
        setBookingForm({
            customerName: '',
            date: '',
            time: '',
            guests: 1
        });
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingForm(f => ({ ...f, [name]: value }));
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRestaurant) return;

        try {
            await api.post('/bookings', {
                ...bookingForm,
                restaurantId: selectedRestaurant._id
            });
            toast.success(`Table booked successfully at ${selectedRestaurant.name}!`);
            setBookingModal(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to book table. Please try again.');
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #FFF5F6, white)' }}>
            <Navbar />

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative py-20 sm:py-24 lg:py-32"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl" style={{ color: '#4F191E' }}>
                        <span className="block">Welcome to</span>
                        <span className="block" style={{ color: '#E03446' }}>Foodie</span>
                    </h1>
                    <p className="mt-6 text-xl max-w-2xl mx-auto" style={{ color: '#EF4F5F' }}>
                        Discover, review and book the best restaurants near you. Your perfect dining experience starts here.
                    </p>
                    <div className="mt-10 max-w-xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5" style={{ color: '#FF7B8B' }} aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-4 rounded-full focus:outline-none focus:ring-2 sm:text-sm bg-white"
                                style={{ 
                                    border: '1px solid #FFDBE0',
                                    color: '#4F191E',
                                    '--tw-ring-color': '#EF4F5F'
                                }}
                                placeholder="Search restaurants by name, "
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </motion.section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <SkeletonLoader key={i} height={400} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl" style={{ color: '#FF7B8B' }}>No restaurants found</h3>
                        <p className="mt-2" style={{ color: '#FFB3C0' }}>Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((hotel) => (
                            <motion.div
                                key={hotel._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                onClick={() => navigate(`/hotels/${hotel._id}`)}
                            >
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src={hotel.imageUrl && hotel.imageUrl.startsWith('http') ? hotel.imageUrl : 'https://placehold.co/800x600'}
                                        alt={hotel.name || 'Restaurant'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold" style={{ color: '#4F191E' }}>{hotel.name}</h2>
                                            <p className="text-sm flex items-center mt-1" style={{ color: '#EF4F5F' }}>
                                                <MapPinIcon className="h-4 w-4 mr-1" />
                                                {hotel.address}
                                            </p>
                                        </div>
                                        {hotel.rating && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium" style={{ backgroundColor: '#FFEDEF', color: '#D11823' }}>
                                                <StarIcon className="h-4 w-4 mr-1" />
                                                {hotel.rating}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm" style={{ color: '#BF238' }}>
                                            <span className="font-medium">Contact:</span> {hotel.contactNumber}
                                        </p>
                                        <p className="text-sm" style={{ color: '#FF7B8B' }}>{hotel.email}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {hotel.cuisine && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#FFF5F6', color: '#BF238' }}>
                                                {hotel.cuisine}
                                            </span>
                                        )}
                                        <button
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm 
                                                     text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 
                                                     transition-colors duration-200"
                                            style={{ 
                                                backgroundColor: '#E03446',
                                                '--tw-ring-color': '#EF4F5F'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                            onClick={() => openBookingModal(hotel)}
                                        >
                                            Book Table
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Booking Modal */}
            <Dialog
                open={bookingModal}
                onClose={() => setBookingModal(false)}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <DialogBackdrop className="fixed inset-0 bg-black opacity-30" />

                    <DialogPanel className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
                        <DialogTitle className="text-2xl font-bold mb-6" style={{ color: '#4F191E' }}>
                            Book Table at {selectedRestaurant?.name}
                        </DialogTitle>

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#BF238' }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    placeholder="Enter your full name"
                                    value={bookingForm.customerName}
                                    onChange={handleBookingChange}
                                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none bg-white"
                                    style={{ 
                                        border: '1px solid #FFDBE0',
                                        color: '#4F191E',
                                        '--tw-ring-color': '#EF4F5F'
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#BF238' }}>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={bookingForm.date}
                                    onChange={handleBookingChange}
                                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none bg-white"
                                    style={{ 
                                        border: '1px solid #FFDBE0',
                                        color: '#4F191E',
                                        '--tw-ring-color': '#EF4F5F'
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#BF238' }}>
                                    Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={bookingForm.time}
                                    onChange={handleBookingChange}
                                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none bg-white"
                                    style={{ 
                                        border: '1px solid #FFDBE0',
                                        color: '#4F191E',
                                        '--tw-ring-color': '#EF4F5F'
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: '#BF238' }}>
                                    Number of Guests
                                </label>
                                <input
                                    type="number"
                                    name="guests"
                                    min="1"
                                    max="10"
                                    value={bookingForm.guests}
                                    onChange={handleBookingChange}
                                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none bg-white"
                                    style={{ 
                                        border: '1px solid #FFDBE0',
                                        color: '#4F191E',
                                        '--tw-ring-color': '#EF4F5F'
                                    }}
                                    required
                                />
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-md"
                                    style={{ 
                                        border: '1px solid #FFDBE0',
                                        color: '#BF238'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF5F6'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    onClick={() => setBookingModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                                    style={{ 
                                        backgroundColor: '#E03446',
                                        '--tw-ring-color': '#EF4F5F'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </div >
    );
};

export default Home;