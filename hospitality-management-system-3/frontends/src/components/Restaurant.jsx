import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './UI/Navbar';
import LoadingSpinner from './UI/LoadingSpinner';

const Restaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/restaurants/${id}`)
            .then(res => res.json())
            .then(data => {
                setRestaurant(data);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!restaurant) return <div>Not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-8 flex flex-col items-center">
                <img src={restaurant.image} alt={restaurant.name} className="w-40 h-40 object-cover rounded-full mb-4 border-2 border-indigo-200" />
                <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-1">{restaurant.address}</p>
                <p className="text-gray-600 mb-1">Contact: {restaurant.contact}</p>
                <p className="text-gray-500 mb-1">Cuisine: {restaurant.cuisine?.join(', ')}</p>
                <p className="text-yellow-500 font-bold mb-2">Rating: {restaurant.rating || 'N/A'}</p>
                {/* Table availability, menu, booking/order buttons will go here */}
            </div>
        </div>
    );
};

export default Restaurant;
