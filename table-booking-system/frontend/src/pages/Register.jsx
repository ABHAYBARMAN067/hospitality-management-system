import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
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
        phone: formData.phone || undefined, // Send undefined if empty to avoid sending empty string
        role: formData.role
      });

      if (result.success) {
        // Redirect admin users to admin dashboard
        if (formData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Handle specific field errors from backend
        if (result.validationErrors) {
          // Handle specific validation errors
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
            } else if (err.param === 'role') {
              newFieldErrors.role = err.msg;
            }
          });
          setFieldErrors(newFieldErrors);
        } else if (result.message.includes('email')) {
          setFieldErrors({
            ...fieldErrors,
            email: result.message
          });
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join TableBooking and start booking amazing tables!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className={fieldErrors.name ? 'error' : ''}
            />
            {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={fieldErrors.email ? 'error' : ''}
            />
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number <span className="optional">(Optional)</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={phoneError ? 'error' : ''}
            />
            {phoneError && <div className="field-error">{phoneError}</div>}
            <small className="field-help">Leave empty if you don't want to provide a phone number</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className={fieldErrors.password ? 'error' : ''}
            />
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className={fieldErrors.confirmPassword ? 'error' : ''}
            />
            {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <div className="role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={handleChange}
                />
                <span className="role-label">User Account</span>
                <small className="role-description">Book tables and manage bookings</small>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                />
                <span className="role-label">Admin Account</span>
                <small className="role-description">Manage hotels, bookings, and users</small>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
