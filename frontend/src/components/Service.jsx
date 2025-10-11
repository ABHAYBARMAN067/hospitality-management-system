import React from 'react';
import Navbar from './UI/Navbar';

const Service = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Services</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Restaurant Discovery</h2>
              <p className="text-gray-700">
                Explore a curated selection of restaurants based on your preferences, location, and cuisine type.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Table Reservations</h2>
              <p className="text-gray-700">
                Book tables at your favorite restaurants instantly with our easy-to-use reservation system.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reviews & Ratings</h2>
              <p className="text-gray-700">
                Read authentic reviews from other diners and share your own experiences to help others.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Menu Exploration</h2>
              <p className="text-gray-700">
                Browse detailed menus, check prices, and get recommendations for your next meal.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Admin Management</h2>
              <p className="text-gray-700">
                Restaurant owners can manage their establishments, menus, and bookings through our admin panel.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customer Support</h2>
              <p className="text-gray-700">
                Our dedicated support team is here to assist you with any questions or issues you may have.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
