import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaBars, FaTimes, FaSearch, FaBell, FaShoppingCart, FaHeart, FaQuestionCircle } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/restaurants', label: 'Restaurants' },
    ...(user ? [
      { path: '/bookings', label: 'Bookings' },
      { path: '/orders', label: 'Orders' },
      { path: '/reviews', label: 'Reviews' }
    ] : []),
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
    ...(user?.role === 'owner' ? [{ path: `/owner/${user.restaurantId}`, label: 'My Restaurant' }] : []),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 backdrop-blur-md ${
          isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'
        } border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400"
              onClick={closeMobileMenu}
            >
              🍽️ SpiceVilla
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />

              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  className="w-64 px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <div className="relative">
                    <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <FaBell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        3
                      </span>
                    </button>
                  </div>

                  {/* Cart/Orders */}
                  <Link
                    to="/orders"
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                  </Link>

                  {/* Favorites */}
                  <Link
                    to="/favorites"
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <FaHeart className="w-5 h-5" />
                  </Link>

                  {/* Help */}
                  <Link
                    to="/help"
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    <FaQuestionCircle className="w-5 h-5" />
                  </Link>

                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      location.pathname === '/profile'
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    <FaUser />
                    <span className="hidden lg:inline">{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      location.pathname === '/login'
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      location.pathname === '/register'
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-40 md:hidden ${
              isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
            } backdrop-blur-sm`}
            onClick={closeMobileMenu}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Menu
                  </span>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 py-4">
                  {/* Mobile Search */}
                  <div className="px-4 mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search restaurants..."
                        className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <nav className="space-y-2 px-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                          location.pathname === item.path
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}

                    {/* Mobile Quick Actions */}
                    {user && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                        <Link
                          to="/orders"
                          onClick={closeMobileMenu}
                          className="flex items-center px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <FaShoppingCart className="w-5 h-5 mr-3" />
                          Orders
                          <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            2
                          </span>
                        </Link>
                        <Link
                          to="/favorites"
                          onClick={closeMobileMenu}
                          className="flex items-center px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <FaHeart className="w-5 h-5 mr-3" />
                          Favorites
                        </Link>
                        <Link
                          to="/help"
                          onClick={closeMobileMenu}
                          className="flex items-center px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          <FaQuestionCircle className="w-5 h-5 mr-3" />
                          Help & Support
                        </Link>
                      </>
                    )}
                  </nav>
                </div>

                {/* Mobile User Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <FaUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {user.name}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Link
                          to="/profile"
                          onClick={closeMobileMenu}
                          className={`block w-full px-4 py-2 rounded-lg transition-colors ${
                            location.pathname === '/profile'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            closeMobileMenu();
                          }}
                          className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className={`block w-full px-4 py-2 rounded-lg transition-colors ${
                          location.pathname === '/login'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className={`block w-full px-4 py-2 rounded-lg transition-colors ${
                          location.pathname === '/register'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
