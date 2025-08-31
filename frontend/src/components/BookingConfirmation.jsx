import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BookingConfirmation = ({ bookingDetails, onBack, onConfirm }) => {
  const { user, login, signup } = useContext(AuthContext);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Create user data object for login
        const userData = {
          id: Date.now(), // Generate a temporary ID
          name: formData.name || "User",
          email: formData.email,
        };
        login(userData);
      } else {
        // Create user data object for signup
        const userData = {
          id: Date.now(), // Generate a temporary ID
          name: formData.name,
          email: formData.email,
        };
        signup(userData);
      }
      setShowAuthForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleConfirmBooking = () => {
    if (!user) {
      setShowAuthForm(true);
      return;
    }
    onConfirm(bookingDetails);
  };

  if (showAuthForm) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? 'Login' : 'Sign Up'} Required
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please {isLogin ? 'login' : 'sign up'} to confirm your booking
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>

          <button
            onClick={() => setShowAuthForm(false)}
            className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Confirm Your Booking
        </h2>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Hotel:</span>
              <span className="font-medium">{bookingDetails.hotelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Table:</span>
              <span className="font-medium">{bookingDetails.tableName} (Capacity: {bookingDetails.capacity})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{bookingDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-bold text-red-600">₹{bookingDetails.price}</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Booking for:</h3>
            <p className="text-blue-700">{user.name || user.email}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handleConfirmBooking}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
          >
            {user ? 'Confirm Booking' : 'Login to Confirm'}
          </button>
        </div>

        {!user && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            You can browse as a guest, but login is required to complete booking
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation; 