import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalHotels: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/dashboard-stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalBookings}</h3>
                <p className="text-gray-600">Total Bookings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏨</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalHotels}</h3>
                <p className="text-gray-600">Total Hotels</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💰</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</h3>
                <p className="text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hotels'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('hotels')}
              >
                Hotels
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} loading={loading} />
            )}

            {activeTab === 'hotels' && (
              <HotelsTab />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab />
            )}

            {activeTab === 'users' && (
              <UsersTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, loading }) => {
  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="overview-tab">
      <div className="overview-grid">
        <div className="overview-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-description">New booking created</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">4 hours ago</span>
              <span className="activity-description">Hotel "The Golden Spoon" added</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-description">User registration spike</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Revenue This Month</h3>
          <div className="revenue-chart">
            <div className="chart-placeholder">
              <p>📈 Revenue chart would go here</p>
              <p>Current: ₹{stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hotels Tab Component
const HotelsTab = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/hotels');

      // Fix: Correctly access the hotels data from API response
      // The API returns { success: true, count: number, data: hotels[] }
      // So we access response.data.data, not response.data.data.hotels
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setHotels(response.data.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setHotels([]);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      // Fix: Set empty array on error to prevent undefined errors
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hotels-tab">
      <div className="tab-header">
        <h3>Manage Hotels</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-btn"
        >
          Add New Hotel
        </button>
      </div>

      {showAddForm && <AddHotelForm onClose={() => setShowAddForm(false)} />}

      {loading ? (
        <div className="loading">Loading hotels...</div>
      ) : hotels.length === 0 ? (
        <div className="no-data">No hotels found.</div>
      ) : (
        <div className="hotels-list">
          {hotels.map(hotel => (
            <div key={hotel._id || hotel.id} className="hotel-item">
              <div className="hotel-info">
                <h4>{hotel.name}</h4>
                <p>{hotel.address?.city}, {hotel.address?.state}</p>
                <p>Rating: ⭐ {hotel.rating || 0}</p>
              </div>
              <div className="hotel-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Bookings Tab Component
const BookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/bookings');

      // Fix: Correctly access the bookings data from API response
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookings-tab">
      <div className="tab-header">
        <h3>All Bookings</h3>
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="no-data">No bookings found.</div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id || booking.id} className="booking-item">
              <div className="booking-info">
                <h4>{booking.hotel?.name}</h4>
                <p>Customer: {booking.user?.name || 'N/A'}</p>
                <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                <p>Status: <span className={`status ${booking.status}`}>{booking.status}</span></p>
              </div>
              <div className="booking-actions">
                <button className="view-btn">View</button>
                <button className="edit-btn">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Users Tab Component
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/users');

      // Fix: Correctly access the users data from API response
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h3>Manage Users</h3>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="no-data">No users found.</div>
      ) : (
        <div className="users-list">
          {users.map(user => (
            <div key={user._id || user.id} className="user-item">
              <div className="user-info">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p>Role: <span className={`role ${user.role}`}>{user.role}</span></p>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="user-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Add Hotel Form Component
const AddHotelForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    phone: '',
    email: '',
    website: '',
    priceRange: '$$',
    // Add missing fields with default values to match Hotel model
    images: [],
    cuisine: [],
    operatingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    amenities: [],
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.description || !formData.email) {
      alert('Please fill in all required fields (Name, Description, Email)');
      return;
    }

    if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.zipCode) {
      alert('Please fill in all address fields');
      return;
    }

    try {
      // Send the complete hotel data matching the Hotel model structure
      const hotelData = {
        ...formData
      };

      await axios.post('http://localhost:5000/api/admin/hotels', hotelData);
      onClose();
      // Refresh the hotels list
      window.location.reload();
    } catch (error) {
      console.error('Error creating hotel:', error);
      if (error.response?.data?.message) {
        alert(`Failed to create hotel: ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert('Failed to create hotel. Please check your input and try again.');
      }
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Hotel</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-hotel-form">
          <div className="form-row">
            <div className="form-group">
              <label>Hotel Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Price Range</label>
              <select
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
              >
                <option value="$">$ - Budget</option>
                <option value="$$">$$ - Moderate</option>
                <option value="$$$">$$$ - Expensive</option>
                <option value="$$$$">$$$$ - Luxury</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-section">
            <h4>Address Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Zip Code *</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Hotel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
