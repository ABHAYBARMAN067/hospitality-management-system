import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FaTachometerAlt,
  FaUtensils,
  FaCalendarCheck,
  FaShoppingBag,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/menu', label: 'Menu Management', icon: FaUtensils },
    { path: '/admin/bookings', label: 'Bookings', icon: FaCalendarCheck },
    { path: '/admin/orders', label: 'Orders', icon: FaShoppingBag },
    { path: '/admin/reports', label: 'Reports', icon: FaChartBar },
  ];

  const ownerNavItems = [
    { path: `/owner/${user?.restaurantId}`, label: 'Dashboard', icon: FaTachometerAlt },
    { path: `/owner/${user?.restaurantId}/menu`, label: 'Menu Management', icon: FaUtensils },
    { path: `/owner/${user?.restaurantId}/bookings`, label: 'Bookings', icon: FaCalendarCheck },
    { path: `/owner/${user?.restaurantId}/orders`, label: 'Orders', icon: FaShoppingBag },
    { path: `/owner/${user?.restaurantId}/reports`, label: 'Reports', icon: FaChartBar },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : ownerNavItems;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: isOpen ? 0 : -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed left-0 top-0 h-full w-64 z-50 transform ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        } shadow-xl border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {user?.role === 'admin' ? 'Admin Panel' : 'Owner Panel'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user?.role === 'admin' ? 'Administrator' : 'Restaurant Owner'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => toggleSidebar()}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <FaUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/profile"
                onClick={() => toggleSidebar()}
                className="flex items-center px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaUser className="w-4 h-4 mr-3" />
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleSidebar();
                }}
                className="flex items-center w-full px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AdminSidebar;
