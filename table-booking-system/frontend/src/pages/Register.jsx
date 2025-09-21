import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: 'Passwords do not match'
      });
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setFieldErrors({
        ...fieldErrors,
        password: 'Password must be at least 6 characters long'
      });
      setLoading(false);
      return;
    }

    // Validate phone if provided
    const phoneValidationError = validatePhone(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: 'user'
      });

      if (result.success) {
        navigate('/');
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
            }
          });
          setFieldErrors(newFieldErrors);
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>User Registration</h1>
          <p style={{ color: '#6b7280' }}>Create your user account</p>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
                {error}
              </div>
            )}

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
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: fieldErrors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: fieldErrors.name ? '#fef2f2' : 'white'
                }}
              />
              {fieldErrors.name && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#dc2626' }}>{fieldErrors.name}</p>
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
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: fieldErrors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: fieldErrors.email ? '#fef2f2' : 'white'
                }}
              />
              {fieldErrors.email && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#dc2626' }}>{fieldErrors.email}</p>
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
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: phoneError ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: phoneError ? '#fef2f2' : 'white'
                }}
              />
              {phoneError && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#dc2626' }}>{phoneError}</p>
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
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: fieldErrors.password ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: fieldErrors.password ? '#fef2f2' : 'white'
                }}
              />
              {fieldErrors.password && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#dc2626' }}>{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: fieldErrors.confirmPassword ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: fieldErrors.confirmPassword ? '#fef2f2' : 'white'
                }}
              />
              {fieldErrors.confirmPassword && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#dc2626' }}>{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                background: loading ? '#9ca3af' : '#3b82f6',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#6b7280' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ fontWeight: '500', color: '#3b82f6', textDecoration: 'none' }}
                onMouseOver={(e) => e.target.style.color = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.color = '#3b82f6'}
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Want to register as an admin?{' '}
              <Link
                to="/admin-registration"
                style={{ fontWeight: '500', color: '#10b981', textDecoration: 'none' }}
                onMouseOver={(e) => e.target.style.color = '#059669'}
                onMouseOut={(e) => e.target.style.color = '#10b981'}
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
