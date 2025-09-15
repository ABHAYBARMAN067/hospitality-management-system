import React, { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, signupUser } from "../utils/api";

export const AuthContext = createContext();

// Token management
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check token expiration
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Token validation error:', error);
      return true;
    }
  }, []);

  // Function to check if token needs refresh
  const needsRefresh = useCallback((token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 - Date.now() < TOKEN_REFRESH_THRESHOLD;
    } catch (error) {
      console.error('Token refresh check error:', error);
      return false;
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (!isTokenExpired(parsedUser.token)) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenExpired]);

  // Login function with validation
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const response = await loginUser(credentials);
      const { user: userData, token } = response.data;

      const userWithToken = {
        ...userData,
        token
      };

      // Validate user data before setting
      if (!userWithToken.id || !userWithToken.token) {
        throw new Error('Invalid user data received');
      }

      // Store in localStorage and state
      localStorage.setItem("user", JSON.stringify(userWithToken));
      setUser(userWithToken);

      return userWithToken;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  }, []);

  // Signup function with validation
  const signup = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      // Validate required fields
      const requiredFields = ['email', 'password', 'name'];
      const missingFields = requiredFields.filter(field => !userData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await signupUser(userData);
      const { user: newUser, token } = response.data;

      const userWithToken = {
        ...newUser,
        token
      };

      localStorage.setItem("user", JSON.stringify(userWithToken));
      setUser(userWithToken);

      return userWithToken;
    } catch (error) {
      setError(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Auto logout on token expiration
  useEffect(() => {
    if (user?.token && isTokenExpired(user.token)) {
      logout();
    }
  }, [user, isTokenExpired, logout]);

  // Context value
  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
