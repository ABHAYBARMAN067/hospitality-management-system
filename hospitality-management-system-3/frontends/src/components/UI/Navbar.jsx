import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const toggleDropdown = () => setShowProfileDropdown(!showProfileDropdown);

  return (
    <nav className="bg-white shadow flex items-center justify-between px-6 py-3">
      <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
        <span role="img" aria-label="logo">🍽️</span> Foodie
      </div>

      <ul className="flex gap-6 text-gray-700 font-medium items-center">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition'}>
            Home
          </NavLink>
        </li>

        {/* User Links */}
        {user && user.role === 'user' && (
          <>
            <li>
              <NavLink to="/my-table" className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition'}>
                My Table
              </NavLink>
            </li>
          </>
        )}

        {/* Admin Links */}
        {user && user.role === 'admin' && (
          <>
            <li>
              <NavLink to="/admin/my-restaurants" className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition'}>
                My Restaurants
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition'}>
                Bookings
              </NavLink>
            </li>
          </>
        )}

        {/* Profile Dropdown */}
        {user && (
          <li className="relative">
            <button onClick={toggleDropdown} className="hover:text-indigo-600 transition flex items-center gap-1">
              Profile ▼
            </button>
            {showProfileDropdown && (
              <ul className="absolute right-0 mt-2 w-40 bg-white border shadow rounded-md py-1 z-50">
                <li>
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                </li>
                <li>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                </li>
              </ul>
            )}
          </li>
        )}

        {/* Logged out */}
        {!user && (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition'}>
                Sign In
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition'}>
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
