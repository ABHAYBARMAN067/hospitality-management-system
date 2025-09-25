import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isOwnerRoute = location.pathname.startsWith('/owner');

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
  ];

  const ownerNavItems = [
    { path: `/owner/${user?.restaurantId || ''}`, label: 'Dashboard', icon: '📊' },
    { path: `/owner/${user?.restaurantId || ''}/menu`, label: 'Menu', icon: '🍽️' },
    { path: `/owner/${user?.restaurantId || ''}/bookings`, label: 'Bookings', icon: '📅' },
    { path: `/owner/${user?.restaurantId || ''}/orders`, label: 'Orders', icon: '📋' },
    { path: `/owner/${user?.restaurantId || ''}/reports`, label: 'Reports', icon: '📈' },
  ];

  const navItems = isOwnerRoute ? ownerNavItems : adminNavItems;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isOwnerRoute ? 'Owner Panel' : 'Admin Panel'}
          </h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-200 transition-colors ${
                location.pathname === item.path ? 'bg-gray-200 border-r-4 border-blue-500' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {isOwnerRoute ? 'Restaurant Management' : 'Admin Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
