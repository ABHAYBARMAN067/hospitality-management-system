import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  const toggleDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const baseLink = (isActive) =>
    `${isActive
      ? 'text-gray-900 dark:text-white'
      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`;

  return (
    <nav style={{ backgroundColor: 'white' }} className="shadow-lg dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E03446' }}>
                  <span className="text-white font-bold text-xl">HH</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold" style={{ color: '#E03546' }}>HospitalityHub</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Discover Hotels</p>
                </div>
              </Link>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                style={({ isActive }) => isActive ? { borderColor: '#EF4F5F', color: 'black' } : { borderColor: 'transparent', color: 'black' }}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                style={({ isActive }) => isActive ? { borderColor: '#EF4F5F', color: 'black' } : { borderColor: 'transparent', color: 'black' }}
              >
                About
              </NavLink>
              <NavLink
                to="/services"
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                style={({ isActive }) => isActive ? { borderColor: '#EF4F5F', color: 'black' } : { borderColor: 'transparent', color: 'black' }}
              >
                Services
              </NavLink>
              <NavLink
                to="/contact"
                className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                style={({ isActive }) => isActive ? { borderColor: '#EF4F5F', color: 'black' } : { borderColor: 'transparent', color: 'black' }}
              >
                Contact
              </NavLink>

              {user && user.role === 'user' && (
                <NavLink
                  to="/my-table"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  style={({ isActive }) => isActive ? { borderColor: '#EF4F5F', color: 'black' } : { borderColor: 'transparent', color: 'black' }}
                >
                  My Table
                </NavLink>
              )}

              {user && user.role === 'admin' && (
                <>
                  <NavLink
                    to="/admin/my-restaurants"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    style={({ isActive }) => isActive ? { borderColor: '#EF4F5F', color: 'black' } : { borderColor: 'transparent', color: 'black' }}
                  >
                    My Restaurants
                  </NavLink>
                  <NavLink
                    to="/admin/bookings"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    style={({ isActive }) => isActive ? { borderColor: '#EF4F5F', color: 'black' } : { borderColor: 'transparent', color: 'black' }}
                  >
                    Bookings
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2"
                  style={{ color: 'black', '--tw-ring-color': '#EF4F5F' }}
                >
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#E03446' }}>
                    {user.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'U'}
                  </div>
                  <span className="hidden md:block">{user.name || 'Profile'}</span>
                  <span>▾</span>
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10" style={{ backgroundColor: 'white' }}>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      style={{ color: 'black' }}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      style={{ color: 'black' }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  style={{ color: 'black' }}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white"
                  style={{ backgroundColor: '#E03446' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ color: 'black', '--tw-ring-color': '#EF4F5F' }}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="sm:hidden pb-4">
            <div className="pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${isActive
                    ? 'dark:bg-gray-700 dark:text-white'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${isActive
                    ? 'dark:bg-gray-700 dark:text-white'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
              >
                About
              </NavLink>
              <NavLink
                to="/services"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${isActive
                    ? 'dark:bg-gray-700 dark:text-white'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
              >
                Services
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `${isActive
                    ? 'dark:bg-gray-700 dark:text-white'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
              >
                Contact
              </NavLink>

              {user && user.role === 'user' && (
                <NavLink
                  to="/my-table"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `${isActive
                      ? 'dark:bg-gray-700 dark:text-white'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
                >
                  My Table
                </NavLink>
              )}

              {user && user.role === 'admin' && (
                <>
                  <NavLink
                    to="/admin/my-restaurants"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `${isActive
                        ? 'dark:bg-gray-700 dark:text-white'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                    }
                    style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
                  >
                    My Restaurants
                  </NavLink>
                  <NavLink
                    to="/admin/bookings"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `${isActive
                        ? 'dark:bg-gray-700 dark:text-white'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                    }
                    style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
                  >
                    Bookings
                  </NavLink>
                </>
              )}

              {user && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-base font-medium"
                    style={{ color: 'black' }}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-base font-medium"
                    style={{ color: 'black' }}
                  >
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `${isActive
                        ? 'dark:bg-gray-700 dark:text-white'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                    }
                    style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `${isActive
                        ? 'dark:bg-gray-700 dark:text-white'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`
                    }
                    style={({ isActive }) => isActive ? { backgroundColor: '#FFF5F6', borderColor: '#EF4F5F', color: 'black' } : { color: 'black' }}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
