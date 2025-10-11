import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Restaurant from './components/Restaurant';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import MenuManagement from './components/MenuManagement';
import ReviewForm from './components/ReviewForm';
import About from './components/About';
import Service from './components/Service';
import Contact from './components/Contact';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurant/:id" element={<Restaurant />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Service />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/profile" element={<UserProfile />} />
      <Route path="/menu-management" element={<MenuManagement />} />
      <Route path="/review" element={<ReviewForm />} />
    </Routes>
  </BrowserRouter>
);

export default App;
