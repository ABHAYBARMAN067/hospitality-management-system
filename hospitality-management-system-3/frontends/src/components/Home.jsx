import React, { useEffect, useState } from 'react';
import Navbar from './UI/Navbar';
import SkeletonLoader from './UI/SkeletonLoader';
import api from '../api/api';

const Home = () => {
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
            alert(`Table booked successfully at ${selectedRestaurant.name}!`);
            setBookingModal(false);
        } catch (err) {
            console.error(err);
            alert('Failed to book table. Try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <section className="bg-indigo-600 text-white py-12 text-center shadow">
                <h1 className="text-4xl font-bold mb-2">Welcome to Foodie!</h1>
                <p className="text-lg">Discover & book the best restaurants near you.</p>
            </section>

            <section className="flex flex-wrap gap-4 justify-center items-center py-6">
                <input
                    className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring w-64"
                    type="text"
                    placeholder="Search restaurants..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select onChange={e => setFilter(f => ({ ...f, cuisine: e.target.value }))}>
                    <option value="">All Cuisines</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                </select>
                <select onChange={e => setFilter(f => ({ ...f, location: e.target.value }))}>
                    <option value="">All Locations</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                </select>
                <select onChange={e => setFilter(f => ({ ...f, rating: e.target.value }))}>
                    <option value="">All Ratings</option>
                    <option value="4">4+</option>
                    <option value="3">3+</option>
                </select>
            </section>

            <section className="py-8 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loading ? (
                    <SkeletonLoader height={120} />
                ) : filtered.length === 0 ? (
                    <p className="text-center text-gray-500 w-full">No restaurants found.</p>
                ) : (
                    filtered.map((hotel) => (
                        <div key={hotel._id} className="border rounded p-4 shadow-md bg-white flex flex-col items-center">
                            <img 
                                src={hotel.imageUrl || 'https://via.placeholder.com/400x300'} 
                                alt={hotel.name || 'Restaurant'} 
                                className="w-full h-48 object-cover rounded"
                            />
                            <h2 className="text-xl font-bold mt-2">{hotel.name}</h2>
                            <p className="text-gray-600">{hotel.address}</p>
                            <p className="text-gray-800 font-medium">Contact: {hotel.contactNumber}</p>
                            <p className="text-gray-500">{hotel.email}</p>
                            <button 
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                onClick={() => openBookingModal(hotel)}
                            >
                                Book Table
                            </button>
                        </div>
                    ))
                )}
            </section>

            {/* Booking Modal */}
            {bookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-semibold mb-4">Book Table at {selectedRestaurant.name}</h3>
                        <form onSubmit={handleBookingSubmit} className="space-y-3">
                            <input
                                type="text"
                                name="customerName"
                                placeholder="Your Name"
                                value={bookingForm.customerName}
                                onChange={handleBookingChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                            <input
                                type="date"
                                name="date"
                                value={bookingForm.date}
                                onChange={handleBookingChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                            <input
                                type="time"
                                name="time"
                                value={bookingForm.time}
                                onChange={handleBookingChange}
                                className="w-full border p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="guests"
                                value={bookingForm.guests}
                                onChange={handleBookingChange}
                                className="w-full border p-2 rounded"
                                min="1"
                                required
                            />
                            <div className="flex justify-end gap-2">
                                <button 
                                    type="button" 
                                    className="px-4 py-2 rounded border"
                                    onClick={() => setBookingModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Book
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
