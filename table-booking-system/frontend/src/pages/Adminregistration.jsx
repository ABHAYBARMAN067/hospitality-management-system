import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Adminregistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    hotelName: '',
    hotelAddress: '',
    hotelCity: '',
    hotelState: '',
    hotelZipCode: '',
    hotelDescription: '',
    rentPerDay: '',
    hotelImage: null,
    topDishes: [
      { name: '', image: null, description: '', category: 'Specials', price: '' },
      { name: '', image: null, description: '', category: 'Specials', price: '' },
      { name: '', image: null, description: '', category: 'Specials', price: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const validatePhone = (phone) => {
    if (!phone) return '';
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      return 'Please enter a valid phone number (digits, spaces, hyphens, parentheses, and + prefix allowed)';
    }
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    return '';
  };

  const validateEmail = (email) => {
    // Updated email regex to match backend validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address (e.g., user@example.com)';
    }
    return '';
  };

  const validateHotelDescription = (desc) => {
    if (!desc || desc.trim().length < 10 || desc.trim().length > 1000) {
      return 'Hotel description must be between 10 and 1000 characters';
    }
    return '';
  };

  // New validation to require hotelDescription if role is admin
  const validateHotelDescriptionRequired = (desc, role) => {
    if (role === 'admin') {
      if (!desc || desc.trim().length < 10 || desc.trim().length > 1000) {
        return 'Hotel description must be between 10 and 1000 characters';
      }
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'phone') {
      const error = validatePhone(value);
      setPhoneError(error);
    }

    if (name === 'email') {
      const error = validateEmail(value);
      setFieldErrors(prev => ({ ...prev, email: error }));
    }

    if (name === 'hotelDescription' || name === 'role') {
      const error = validateHotelDescriptionRequired(
        name === 'hotelDescription' ? value : formData.hotelDescription,
        name === 'role' ? value : formData.role
      );
      setFieldErrors(prev => ({ ...prev, hotelDescription: error }));
    }
  };

  const handleDishChange = (index, field, value) => {
    const updatedDishes = [...formData.topDishes];
    updatedDishes[index][field] = value;
    setFormData(prev => ({ ...prev, topDishes: updatedDishes }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'hotelImage') {
      setFormData(prev => ({ ...prev, hotelImage: files[0] }));
    } else if (name.startsWith('dishImage')) {
      const index = parseInt(name.replace('dishImage', ''), 10);
      const updatedDishes = [...formData.topDishes];
      updatedDishes[index].image = files[0];
      setFormData(prev => ({ ...prev, topDishes: updatedDishes }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      // Trim email to avoid invalid format errors
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('role', 'admin');

      formDataToSend.append('hotelName', formData.hotelName);
      formDataToSend.append('hotelAddress', formData.hotelAddress);
      formDataToSend.append('hotelCity', formData.hotelCity);
      formDataToSend.append('hotelState', formData.hotelState);
      formDataToSend.append('hotelZipCode', formData.hotelZipCode);
      // Trim hotelDescription to avoid empty string errors
      formDataToSend.append('hotelDescription', formData.hotelDescription.trim());
      // FIX: Convert rentPerDay to number for backend validation
      formDataToSend.append('rentPerDay', parseFloat(formData.rentPerDay) || 0);

      if (formData.hotelImage) {
        formDataToSend.append('hotelImage', formData.hotelImage, formData.hotelImage.name);
      }

      // Fix: send topDishes as array of objects with name and other properties
      const topDishesArray = formData.topDishes
        .filter(dish => dish.name && dish.name.trim()) // Only include dishes with names
        .map(dish => ({
          name: dish.name.trim(),
          description: dish.description || `${dish.name} - Top dish`,
          category: dish.category || 'Specials',
          price: dish.price || '0'
        }));
      formDataToSend.append('topDishes', JSON.stringify(topDishesArray));

      // Send dish images with proper field names
      formData.topDishes.forEach((dish, index) => {
        if (dish.image) {
          formDataToSend.append(`dishImage${index}`, dish.image, dish.image.name);
        }
      });

      // Also support sending multiple dish images in a single field
      const dishImages = formData.topDishes
        .map((dish, index) => dish.image)
        .filter(Boolean);

      if (dishImages.length > 0) {
        dishImages.forEach((image, index) => {
          formDataToSend.append('dishImage', image, image.name);
        });
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        if (result.validationErrors) {
          const newFieldErrors = {};
          result.validationErrors.forEach(err => {
            if (err.param === 'phone') {
              setPhoneError(err.msg);
            } else {
              newFieldErrors[err.param] = err.msg;
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
                  {fieldErrors.name && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.name}</p>
                  )}
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
                  {fieldErrors.email && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.email}</p>
                  )}
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
                  {phoneError && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{phoneError}</p>
                  )}
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
                    placeholder="Enter your password (min 6 characters)"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                  {fieldErrors.password && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.password}</p>
                  )}
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
                  {fieldErrors.hotelName && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.hotelName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="hotelAddress" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Hotel Address (Street)
                  </label>
                  <input
                    type="text"
                    id="hotelAddress"
                    name="hotelAddress"
                    value={formData.hotelAddress}
                    onChange={handleChange}
                    required
                    placeholder="Enter hotel street address"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                  {fieldErrors.hotelAddress && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.hotelAddress}</p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="hotelCity" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      id="hotelCity"
                      name="hotelCity"
                      value={formData.hotelCity}
                      onChange={handleChange}
                      required
                      placeholder="City"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                    />
                    {fieldErrors.hotelCity && (
                      <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.hotelCity}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="hotelState" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      State
                    </label>
                    <input
                      type="text"
                      id="hotelState"
                      name="hotelState"
                      value={formData.hotelState}
                      onChange={handleChange}
                      required
                      placeholder="State"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                    />
                    {fieldErrors.hotelState && (
                      <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.hotelState}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="hotelZipCode" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="hotelZipCode"
                      name="hotelZipCode"
                      value={formData.hotelZipCode}
                      onChange={handleChange}
                      required
                      placeholder="ZIP Code"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                    />
                    {fieldErrors.hotelZipCode && (
                      <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.hotelZipCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="hotelDescription" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Hotel Description
                  </label>
                  <textarea
                    id="hotelDescription"
                    name="hotelDescription"
                    value={formData.hotelDescription}
                    onChange={handleChange}
                    required
                    placeholder="Enter hotel description (minimum 10 characters)"
                    rows="3"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                  {fieldErrors.hotelDescription && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.hotelDescription}</p>
                  )}
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
                    placeholder="Enter rent per day (e.g., 100)"
                    min="0"
                    step="0.01"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
                  />
                  {fieldErrors.rentPerDay && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.rentPerDay}</p>
                  )}
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
