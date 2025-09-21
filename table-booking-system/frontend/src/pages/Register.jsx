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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Registration</h1>
          <p className="text-gray-600">Create your user account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400 ${
                  fieldErrors.name
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {fieldErrors.name && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400 ${
                  fieldErrors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400 ${
                  phoneError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {phoneError && (
                <p className="mt-2 text-sm text-red-600">{phoneError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400 ${
                  fieldErrors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {fieldErrors.password && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400 ${
                  fieldErrors.confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Admin Registration Link */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Want to register as an admin?{' '}
              <Link
                to="/admin-registration"
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
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
