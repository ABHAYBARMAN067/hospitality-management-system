import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBagIcon,
  UserIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import {
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
} from '@heroicons/react/24/solid';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-mobile sticky top-0 z-50 border-b border-gray-100">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={closeMenu}>
            <ShoppingBagIcon className="h-8 w-8 md:h-10 md:w-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-responsive-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              E-Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-blue-50 font-medium focus-enhanced"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-blue-50 font-medium focus-enhanced"
            >
              Products
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-blue-600 transition-all duration-200 p-2 rounded-lg hover:bg-blue-50 focus-enhanced"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-blue-50 font-medium focus-enhanced">
                    <UserIcon className="h-6 w-6" />
                    <span className="text-responsive-sm">{user?.name || 'User'}</span>
                  </button>

                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-mobile-lg border border-gray-100 py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <ShoppingBagIcon className="h-4 w-4 mr-3" />
                      Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium focus-enhanced"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-responsive-sm font-semibold px-6 py-3 rounded-xl shadow-mobile hover:shadow-mobile-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus-enhanced"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="p-responsive-md space-responsive-sm">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                onClick={closeMenu}
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                Home
              </Link>
              <Link
                to="/products"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                onClick={closeMenu}
              >
                <ShoppingBagIcon className="h-5 w-5 mr-3" />
                Products
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                    onClick={closeMenu}
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-3" />
                    Cart
                    {itemCount > 0 && (
                      <span className="ml-auto bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                    onClick={closeMenu}
                  >
                    <UserIcon className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                    onClick={closeMenu}
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-3" />
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                      onClick={closeMenu}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-3" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    <XMarkIcon className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="space-responsive-sm pt-4 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center btn-primary text-responsive-sm font-semibold px-6 py-3 rounded-xl shadow-mobile hover:shadow-mobile-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
