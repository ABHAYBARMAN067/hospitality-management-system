import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../utils/api';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Hotel Details
    hotelName: '',
    city: '',
    address: '',
    hotelPhoto: null,
    
    // Top 3 Dishes
    dishes: [
      { name: '', image: null },
      { name: '', image: null },
      { name: '', image: null }
    ],
    
    // Admin Credentials
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Jabalpur', 'Bhopal', 'Indore', 'Gwalior', 'Ujjain'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDishChange = (index, field, value) => {
    const newDishes = [...formData.dishes];
    newDishes[index] = { ...newDishes[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      dishes: newDishes
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleDishImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      handleDishChange(index, 'image', file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Hotel Details Validation
    if (!formData.hotelName.trim()) newErrors.hotelName = 'Hotel name is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.hotelPhoto) newErrors.hotelPhoto = 'Hotel photo is required';

    // Dishes Validation
    formData.dishes.forEach((dish, index) => {
      if (!dish.name.trim()) {
        newErrors[`dish${index}Name`] = `Dish ${index + 1} name is required`;
      }
      if (!dish.image) {
        newErrors[`dish${index}Image`] = `Dish ${index + 1} image is required`;
      }
    });

    // Admin Credentials Validation
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create the admin user account
      const adminData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'admin'
      };

      const adminResponse = await signupUser(adminData);
      const { user, token } = adminResponse.data;

      // Then create the hotel with images
      const formDataToSend = new FormData();
      
      // Add hotel details
      formDataToSend.append('name', formData.hotelName);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('address', formData.address);
      
      // Add hotel image
      if (formData.hotelPhoto) {
        formDataToSend.append('hotelImage', formData.hotelPhoto);
      }
      
      // Add dish details and images
      formData.dishes.forEach((dish, index) => {
        formDataToSend.append(`topDishes[${index}][name]`, dish.name);
        if (dish.image) {
          formDataToSend.append(`dishImage${index}`, dish.image);
        }
      });

      // Create hotel (you'll need to add this API endpoint)
      const hotelResponse = await fetch('http://localhost:5000/api/hotels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!hotelResponse.ok) {
        const errorData = await hotelResponse.json();
        console.error('Hotel creation error:', errorData);
        throw new Error(`Failed to create hotel: ${errorData.message || 'Unknown error'}`);
      }

      alert('Admin account and hotel created successfully! You can now login.');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      const message = error?.response?.data?.message || error.message || 'Error creating admin account. Please try again.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImage = (file, field) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Signup</h1>
            <p className="text-gray-600">Create your hotel admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hotel Details Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Hotel Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hotel Name *
                  </label>
                  <input
                    type="text"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleInputChange}
                    placeholder="e.g., Vijan Mahal"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                      errors.hotelName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.hotelName && (
                    <p className="text-red-500 text-sm mt-1">{errors.hotelName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., Near XYZ Road, Jabalpur"
                  rows="3"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Photo *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'hotelPhoto')}
                    className="hidden"
                    id="hotelPhoto"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="hotelPhoto"
                    className={`cursor-pointer px-6 py-3 rounded-lg text-white ${
                      isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Choose Photo
                  </label>
                  {formData.hotelPhoto && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={previewImage(formData.hotelPhoto, 'hotelPhoto')}
                        alt="Hotel Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <span className="text-sm text-gray-600">{formData.hotelPhoto.name}</span>
                    </div>
                  )}
                </div>
                {errors.hotelPhoto && (
                  <p className="text-red-500 text-sm mt-1">{errors.hotelPhoto}</p>
                )}
              </div>
            </div>

            {/* Top 3 Dishes Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Top 3 Dishes</h2>
              
              <div className="space-y-6">
                {formData.dishes.map((dish, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Dish {index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dish Name *
                        </label>
                        <input
                          type="text"
                          value={dish.name}
                          onChange={(e) => handleDishChange(index, 'name', e.target.value)}
                          placeholder={`Dish ${index + 1} name`}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                            errors[`dish${index}Name`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={isSubmitting}
                        />
                        {errors[`dish${index}Name`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`dish${index}Name`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dish Image *
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDishImageChange(index, e)}
                            className="hidden"
                            id={`dishImage${index}`}
                            disabled={isSubmitting}
                          />
                          <label
                            htmlFor={`dishImage${index}`}
                            className={`cursor-pointer px-4 py-2 rounded-lg text-white text-sm ${
                              isSubmitting ? 'bg-gray-400' : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            Choose Image
                          </label>
                          {dish.image && (
                            <img
                              src={previewImage(dish.image, `dish${index}`)}
                              alt={`Dish ${index + 1} Preview`}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                        </div>
                        {errors[`dish${index}Image`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`dish${index}Image`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Credentials Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Credentials</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-medium text-white ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Admin Account'}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an admin account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup; 