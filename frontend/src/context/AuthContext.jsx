import React, { createContext, useState, useEffect } from "react";
import { loginUser, signupUser } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { user: userData, token } = response.data;
      
      const userWithToken = {
        ...userData,
        token
      };
      
      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await signupUser(userData);
      const { user: newUser, token } = response.data;
      
      const userWithToken = {
        ...newUser,
        token
      };
      
      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
