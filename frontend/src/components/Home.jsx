import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, MapPinIcon, StarIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import Navbar from './UI/Navbar';
import SkeletonLoader from './UI/SkeletonLoader';
import api from '../api/api';

const Home = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ rating: '' });
    const [showFilters, setShowFilters] = useState(false);



    useEffect(() => {
        api.get('/restaurants')
            .then(res => {
                setRestaurants(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);



    const filtered = restaurants.filter(r => {
        const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.cuisine?.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
            r.address?.toLowerCase().includes(search.toLowerCase());

        const matchesRating = !filter.rating || r.rating >= Number(filter.rating);

        return matchesSearch && matchesRating;
    });

    // Sort restaurants
    const sortedRestaurants = [...filtered];



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
                        <span className="block" style={{ color: '#E03446' }}>HospitalityHub</span>
                    </h1>
                    <p className="mt-6 text-xl max-w-2xl mx-auto" style={{ color: '#EF4F5F' }}>
                        Discover, review and book the best restaurants near you. Your perfect dining experience starts here.
                    </p>
                    <div className="mt-10 max-w-2xl mx-auto space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5" style={{ color: '#FF7B8B' }} aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-12 py-4 rounded-full focus:outline-none focus:ring-2 sm:text-sm bg-white"
                                style={{
                                    border: '1px solid #FFDBE0',
                                    color: '#4F191E',
                                    '--tw-ring-color': '#EF4F5F'
                                }}
                                placeholder="Search restaurants by name, cuisine, or location..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <AdjustmentsHorizontalIcon className="h-5 w-5" style={{ color: '#FF7B8B' }} />
                            </button>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6 border"
                                style={{ borderColor: '#FFDBE0' }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold" style={{ color: '#4F191E' }}>Filters</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <XMarkIcon className="h-5 w-5" style={{ color: '#FF7B8B' }} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {/* Rating Filter */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: '#BF238' }}>
                                            Min Rating
                                        </label>
                                        <select
                                            value={filter.rating}
                                            onChange={e => setFilter(f => ({ ...f, rating: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:outline-none bg-white"
                                            style={{
                                                border: '1px solid #FFDBE0',
                                                color: '#4F191E',
                                                '--tw-ring-color': '#EF4F5F'
                                            }}
                                        >
                                            <option value="">Any Rating</option>
                                            <option value="4.5">4.5+ Stars</option>
                                            <option value="4">4+ Stars</option>
                                            <option value="3">3+ Stars</option>
                                            <option value="2">2+ Stars</option>
                                        </select>
                                    </div>
                                </div>



                                {/* Clear Filters */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setFilter({ rating: '' })}
                                        className="px-4 py-2 text-sm rounded-md"
                                        style={{
                                            color: '#EF4F5F',
                                            border: '1px solid #EF4F5F'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF5F6'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <SkeletonLoader key={i} height={400} />)}
                    </div>
                ) : sortedRestaurants.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl" style={{ color: '#FF7B8B' }}>No restaurants found</h3>
                        <p className="mt-2" style={{ color: '#FFB3C0' }}>Try adjusting your filters or search terms</p>
                        {(search || Object.values(filter).some(v => v)) && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setFilter({ rating: '', priceRange: '', sortBy: '' });
                                }}
                                className="mt-4 px-4 py-2 text-sm rounded-md"
                                style={{
                                    color: '#EF4F5F',
                                    border: '1px solid #EF4F5F'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF5F6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Clear All Filters & Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Results Summary */}
                        <div className="flex justify-between items-center">
                            <p className="text-sm" style={{ color: '#BF238' }}>
                                Showing {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''}
                                {(search || Object.values(filter).some(v => v)) && ' matching your criteria'}
                            </p>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedRestaurants.map((restaurant) => (
                                <motion.div
                                    key={restaurant._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                                >
                                    <div className="aspect-w-16 aspect-h-9">
                                        <img
                                            src={restaurant.imageUrl && restaurant.imageUrl.startsWith('http') ? restaurant.imageUrl : 'https://placehold.co/800x600'}
                                            alt={restaurant.name || 'Restaurant'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-xl font-bold" style={{ color: '#4F191E' }}>{restaurant.name}</h2>
                                                <p className="text-sm flex items-center mt-1" style={{ color: '#EF4F5F' }}>
                                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                                    {restaurant.address}
                                                </p>
                                            </div>
                                            {restaurant.rating && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium" style={{ backgroundColor: '#FFEDEF', color: '#D11823' }}>
                                                    <StarIcon className="h-4 w-4 mr-1" />
                                                    {restaurant.rating}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm" style={{ color: '#BF238' }}>
                                                <span className="font-medium">Contact:</span> {restaurant.contact}
                                            </p>
                                            <p className="text-sm" style={{ color: '#FF7B8B' }}>{restaurant.email}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#FFF5F6', color: '#BF238' }}>
                                                    {restaurant.cuisine.join(', ')}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/restaurant/${restaurant._id}`);
                                                }}
                                            >
                                                Show Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </section>


        </div >
    );
};

export default Home;