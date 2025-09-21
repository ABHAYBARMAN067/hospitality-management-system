import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Adminregistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    hotelName: '',
    hotelAddress: '',
    rentPerDay: '',
    hotelImage: null,
    topDishes: [
      { name: '', image: null },
      { name: '', image: null },
      { name: '', image: null }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  // Phone validation function
  const validatePhone = (phone) => {
    if (!phone) return ''; // Empty is valid (optional field)
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid phone number (digits, spaces, hyphens, parentheses, and + prefix allowed)';
    }
    if (phone.replace(/\D/g, '').length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }

    // Validate phone number in real-time
    if (name === 'phone') {
      const error = validatePhone(value);
      setPhoneError(error);
    }
  };

  const handleDishChange = (index, field, value) => {
    const updatedDishes = [...formData.topDishes];
    updatedDishes[index][field] = value;
    setFormData({
      ...formData,
      topDishes: updatedDishes
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'hotelImage') {
      setFormData({
        ...formData,
        hotelImage: files[0]
      });
    } else if (name.startsWith('dishImage')) {
      const index = parseInt(name.replace('dishImage', ''));
      const updatedDishes = [...formData.topDishes];
      updatedDishes[index].image = files[0];
      setFormData({
        ...formData,
        topDishes: updatedDishes
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const formDataToSend = new FormData();

      // Add user fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('role', 'admin');

      // Add hotel fields
      formDataToSend.append('hotelName', formData.hotelName);
      formDataToSend.append('hotelAddress', formData.hotelAddress);
      formDataToSend.append('rentPerDay', formData.rentPerDay);

      // Add hotel image
      if (formData.hotelImage) {
        formDataToSend.append('hotelImage', formData.hotelImage);
      }

      // Add top dishes
      formData.topDishes.forEach((dish, index) => {
        if (dish.name && dish.image) {
          formDataToSend.append(`topDishes[${index}][name]`, dish.name);
          formDataToSend.append(`topDishes[${index}][image]`, dish.image);
        }
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/signup`, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        // Store token and user info
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        // Navigate based on role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        if (result.validationErrors) {
          const newFieldErrors = {};
          result.validationErrors.forEach(err => {
            if (err.param === 'name') {
              newFieldErrors.name = err.msg;
            } else if (err.param === 'email') {
              newFieldErrors.email = err.msg;
            } else if (err.param === 'password') {
              newFieldErrors.password = err.msg;
            } else if (err.param === 'phone') {
              setPhoneError(err.msg);
            } else if (err.param === 'hotelName') {
              newFieldErrors.hotelName = err.msg;
            } else if (err.param === 'hotelAddress') {
              newFieldErrors.hotelAddress = err.msg;
            } else if (err.param === 'rentPerDay') {
              newFieldErrors.rentPerDay = err.msg;
            }
          });
          setFieldErrors(newFieldErrors);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('Admin registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Admin Registration</h1>
          <p style={{ color: '#6b7280' }}>Create your admin account and set up your hotel</p>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {/* User Information */}
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937', marginBottom: '16px' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Phone Number <span style={{ color: '#6b7280', fontSize: '12px' }}>(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>

            {/* Hotel Information */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937', marginBottom: '16px' }}>Hotel Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="hotelName" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    id="hotelName"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your hotel name"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label htmlFor="hotelAddress" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Hotel Address
                  </label>
                  <input
                    type="text"
                    id="hotelAddress"
                    name="hotelAddress"
                    value={formData.hotelAddress}
                    onChange={handleChange}
                    required
                    placeholder="Enter hotel address"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label htmlFor="rentPerDay" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Rent Per Day
                  </label>
                  <input
                    type="number"
                    id="rentPerDay"
                    name="rentPerDay"
                    value={formData.rentPerDay}
                    onChange={handleChange}
                    required
                    placeholder="Enter rent per day"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label htmlFor="hotelImage" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Hotel Image
                  </label>
                  <input
                    type="file"
                    id="hotelImage"
                    name="hotelImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>

            {/* Top Dishes */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#1f2937', marginBottom: '16px' }}>Top Dishes (3-6)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {formData.topDishes.map((dish, index) => (
                  <div key={index} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>Dish {index + 1}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                          Dish Name
                        </label>
                        <input
                          type="text"
                          value={dish.name}
                          onChange={(e) => handleDishChange(index, 'name', e.target.value)}
                          placeholder="Enter dish name"
                          style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                          Dish Image
                        </label>
                        <input
                          type="file"
                          name={`dishImage${index}`}
                          onChange={handleFileChange}
                          accept="image/*"
                          style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Back to Register
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  background: loading ? '#9ca3af' : '#10b981',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Adminregistration;
