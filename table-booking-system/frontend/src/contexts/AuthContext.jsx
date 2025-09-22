import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${apiUrl}/api/auth/me`);
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password
      });

      const { user, token } = response.data;

      // Store token
      localStorage.setItem('token', token);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Check if userData is FormData (for admin registration with files)
      const isFormData = userData instanceof FormData;

      let response;

      if (isFormData) {
        // For admin registration with files, don't set Content-Type header
        // Let browser set it with boundary for FormData
        response = await axios.post(`${apiUrl}/api/auth/signup`, userData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it
          }
        });
      } else {
        // For regular user registration
        // Clean up the data before sending
        const cleanData = {
          name: userData.name?.trim(),
          email: userData.email?.trim().toLowerCase(),
          password: userData.password,
          phone: userData.phone?.trim() || undefined, // Send undefined if empty
          role: userData.role || 'user'
        };

        // Remove undefined values
        Object.keys(cleanData).forEach(key => {
          if (cleanData[key] === undefined) {
            delete cleanData[key];
          }
        });

        // Log the data being sent for debugging
        console.log('Sending registration data:', cleanData);
        console.log('Making request to:', `${apiUrl}/api/auth/signup`);

        response = await axios.post(`${apiUrl}/api/auth/signup`, cleanData);
      }

      const { user, token } = response.data;

      // Store token
      localStorage.setItem('token', token);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);

      // Handle validation errors specifically
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        console.log('Validation errors from backend:', validationErrors);

        // Convert validation errors to a more readable format
        const errorMessages = validationErrors.map(err => `${err.param}: ${err.msg}`).join(', ');
        return {
          success: false,
          message: `Validation failed: ${errorMessages}`,
          validationErrors: validationErrors
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];

    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
