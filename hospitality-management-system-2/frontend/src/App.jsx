import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/UI/Navbar';
import Home from './components/Home'; 
import Restaurant from './components/Restaurant';
import Admin from './components/Admin';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';

function App() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Home page ya restaurant listing */}
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Home />} /> {/* List of restaurants */}

          {/* Individual restaurant page */}
          <Route path="/restaurant/:id" element={<Restaurant />} />

          {/* Admin & Auth routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
