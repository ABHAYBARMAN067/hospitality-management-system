import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserBookings, getHotels, updateHotel } from "../utils/api";

// Edit Hotel Modal Component
const EditHotelModal = ({ hotel, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: hotel?.name || "",
    address: hotel?.address || "",
    city: hotel?.city || "",
    price: hotel?.price || 0,
    topDishes: hotel?.topDishes || [],
    newDish: ""
  });

  const addDish = () => {
    if (formData.newDish.trim()) {
      setFormData({
        ...formData,
        topDishes: [...formData.topDishes, formData.newDish.trim()],
        newDish: ""
      });
    }
  };

  const removeDish = (index) => {
    setFormData({
      ...formData,
      topDishes: formData.topDishes.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Hotel Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Table</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top Dishes</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.newDish}
                  onChange={(e) => setFormData({ ...formData, newDish: e.target.value })}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="Add a dish"
                />
                <button
                  type="button"
                  onClick={addDish}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.topDishes.map((dish, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {dish}
                    <button
                      type="button"
                      onClick={() => removeDish(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editingHotel, setEditingHotel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const editHotel = (hotel) => {
    setEditingHotel(hotel);
    setIsEditModalOpen(true);
  };

  const handleUpdateHotel = async (updatedData) => {
    try {
      // Create FormData for the update
      const formData = new FormData();
      formData.append('name', updatedData.name);
      formData.append('city', updatedData.city);
      formData.append('address', updatedData.address);
      formData.append('price', updatedData.price);

      // Add top dishes array
      updatedData.topDishes.forEach((dish, index) => {
        formData.append(`topDishes[${index}]`, dish);
      });

      // Update hotel with new data
      const response = await updateHotel(editingHotel._id, formData);

      if (response.data?.success) {
        // Update local state
        setHotels(hotels.map(hotel =>
          hotel._id === editingHotel._id ? response.data.data : hotel
        ));
        setIsEditModalOpen(false);
        setEditingHotel(null);
      }
    } catch (err) {
      console.error('Error updating hotel:', err);
      alert('Failed to update hotel. Please try again.');
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch bookings and hotels for admin
        const [bookingsResponse, hotelsResponse] = await Promise.all([
          getUserBookings(),
          getHotels()
        ]);
        setBookings(bookingsResponse.data || []);
        setHotels(hotelsResponse.data || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        // Fallback to mock data
        setBookings([
          { _id: 1, user: { name: "John Doe" }, hotel: { name: "The Taj" }, status: "confirmed", date: "2025-09-01", time: "19:00" },
          { _id: 2, user: { name: "Jane Smith" }, hotel: { name: "Oberoi" }, status: "pending", date: "2025-09-02", time: "20:00" },
        ]);
        setHotels([
          { _id: 1, name: "The Taj", city: "Mumbai", address: "123 Marine Drive", rating: 4.8 },
          { _id: 2, name: "Oberoi Hotel", city: "Delhi", address: "456 Luxury Street", rating: 4.6 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, {user.name || user.email}!</p>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'bookings'
            ? 'bg-red-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'hotels'
            ? 'bg-red-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Hotels ({hotels.length})
        </button>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
              <p className="text-gray-500">Bookings will appear here when customers make reservations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id || booking.id}
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {booking.hotel?.name || booking.hotel}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Customer:</span> {booking.user?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {booking.date}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {booking.time || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${booking.status === "confirmed"
                          ? "bg-green-500"
                          : booking.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                          }`}
                      >
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Hotels</h2>
          {hotels.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels registered</h3>
              <p className="text-gray-500 mb-6">Register your first hotel to start accepting bookings.</p>
              <button
                onClick={() => navigate('/admin-signup')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
              >
                Register Hotel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id || hotel.id}
                  className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{hotel.name}</h3>
                  <p className="text-gray-600 mb-2">{hotel.address}</p>
                  <p className="text-gray-500 mb-2">{hotel.city}</p>
                  <div className="flex items-center mb-4">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      ⭐ {hotel.rating || 'N/A'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Top Dishes</h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.topDishes?.map((dish, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {dish}
                        </span>
                      ))}
                      {(!hotel.topDishes || hotel.topDishes.length === 0) && (
                        <span className="text-gray-400 text-sm">No dishes added</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => editHotel(hotel)}
                    className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Edit Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditHotelModal
          hotel={editingHotel}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingHotel(null);
          }}
          onUpdate={handleUpdateHotel}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
