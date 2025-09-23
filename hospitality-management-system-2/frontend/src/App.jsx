import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import PublicLayout from './components/Layout/PublicLayout';
import AdminLayout from './components/Layout/AdminLayout';
import Home from './components/Home';
import Restaurant from './components/Restaurant';
import Admin from './components/Admin';
import RestaurantOwnerDashboard from './components/RestaurantOwnerDashboard';
import Reports from './components/Reports';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Bookings from './components/Bookings';
import Orders from './components/Orders';
import Reviews from './components/Reviews';

function App() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  // Admin/Owner routes that need sidebar
  const adminRoutes = ['/admin', '/owner'];
  const isAdminRoute = adminRoutes.some(route => window.location.pathname.startsWith(route));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
      {isAdminRoute && user?.role ? (
        <AdminLayout>
          <Routes>
            {/* Admin & Owner Dashboard Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/owner/:restaurantId" element={<RestaurantOwnerDashboard />} />
            <Route path="/owner/:restaurantId/menu" element={<div>Menu Management</div>} />
            <Route path="/owner/:restaurantId/bookings" element={<Bookings />} />
            <Route path="/owner/:restaurantId/orders" element={<Orders />} />
            <Route path="/owner/:restaurantId/reports" element={<Reports />} />
          </Routes>
        </AdminLayout>
      ) : (
        <PublicLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Home />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />

            {/* User-specific routes (protected) */}
            <Route path="/bookings" element={user ? <Bookings /> : <Login />} />
            <Route path="/orders" element={user ? <Orders /> : <Login />} />
            <Route path="/reviews" element={user ? <Reviews /> : <Login />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={user ? <UserProfile /> : <Login />} />

            {/* Catch-all route */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </PublicLayout>
      )}
    </div>
  );
}

export default App;
