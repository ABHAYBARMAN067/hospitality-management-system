import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PencilIcon, TruckIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
    email: "",
    image: null,
  });
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyRestaurant();
    fetchBookings();
    fetchOrders();
  }, []);

  const fetchMyRestaurant = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/my-restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) setRestaurant(res.data[0]);
    } catch (err) {
      console.error("Error fetching restaurant:", err.response?.data || err.message);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err.message);
    }
  };

  const fetchOrders = async () => {
    try {
      if (restaurant) {
        const res = await axios.get(`http://localhost:5000/api/orders/restaurant/${restaurant._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, [name]: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));

      await axios.post("http://localhost:5000/api/admin/restaurants", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("✅ Restaurant added successfully!");
      setForm({ name: "", address: "", contactNumber: "", email: "", image: null });
      fetchMyRestaurant();
    } catch (err) {
      console.error("Error adding restaurant:", err.response?.data || err.message);
      alert("❌ Failed to add restaurant");
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/bookings/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings(); // Refresh bookings after update
    } catch (err) {
      console.error("Error updating booking status:", err.response?.data || err.message);
      alert("❌ Failed to update booking");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error("Error updating order status:", err.response?.data || err.message);
      alert("❌ Failed to update order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'preparing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'ready':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'out_for_delivery':
        return <TruckIcon className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFEDEF' }}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-2xl font-bold" style={{ color: 'black' }}>Admin Dashboard</h2>
          <p className="mt-2 text-sm" style={{ color: 'black' }}>
            Manage your restaurant and bookings
          </p>
        </div>

        <div className="mt-8">
          {/* Add Restaurant Form */}
          {!restaurant ? (
            <div className="shadow rounded-lg" style={{ backgroundColor: '#FFEDEF' }}>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 mb-4" style={{ color: 'black' }}>
                  Add Your Restaurant
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium" style={{ color: 'black' }}>
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] sm:text-sm"
                        style={{ backgroundColor: '#FFEDEF', color: 'black' }}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium" style={{ color: 'black' }}>
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={form.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] sm:text-sm"
                        style={{ backgroundColor: '#FFEDEF', color: 'black' }}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium" style={{ color: 'black' }}>
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        id="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] sm:text-sm"
                        style={{ backgroundColor: '#FFEDEF', color: 'black' }}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'black' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-[#EF4F5F] focus:border-[#EF4F5F] sm:text-sm"
                        style={{ backgroundColor: '#FFEDEF', color: 'black' }}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium" style={{ color: 'black' }}>
                      Restaurant Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#EF4F5F]"
                          >
                            <span>Upload a file</span>
                            <input id="image" name="image" type="file" className="sr-only" onChange={handleChange} accept="image/*" required />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                      style={{ backgroundColor: '#E03446' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                    >
                      Add Restaurant
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="shadow rounded-lg overflow-hidden" style={{ backgroundColor: '#FFEDEF' }}>
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium" style={{ color: 'black' }}>
                  Your Restaurant
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" style={{ backgroundColor: '#FFEDEF' }}>
                    <dt className="text-sm font-medium" style={{ color: 'black' }}>Restaurant name</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2" style={{ color: 'black' }}>{restaurant.name}</dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" style={{ backgroundColor: '#FFEDEF' }}>
                    <dt className="text-sm font-medium" style={{ color: 'black' }}>Address</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2" style={{ color: 'black' }}>{restaurant.address}</dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" style={{ backgroundColor: '#FFEDEF' }}>
                    <dt className="text-sm font-medium" style={{ color: 'black' }}>Contact number</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2" style={{ color: 'black' }}>{restaurant.contactNumber}</dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" style={{ backgroundColor: '#FFEDEF' }}>
                    <dt className="text-sm font-medium" style={{ color: 'black' }}>Email</dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2" style={{ color: 'black' }}>{restaurant.email}</dd>
                  </div>
                  {restaurant.imageUrl && (
                    <div className="px-4 py-5 sm:px-6" style={{ backgroundColor: '#FFEDEF' }}>
                      <dt className="text-sm font-medium mb-2" style={{ color: 'black' }}>Restaurant image</dt>
                      <dd className="mt-1">
                        <img src={restaurant.imageUrl} alt={restaurant.name} className="h-48 w-full object-cover rounded-lg" />
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="px-4 py-4 border-t border-gray-200">
                <button
                  onClick={() => navigate('/menu-management')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                  style={{ backgroundColor: '#E03446' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Menu
                </button>
              </div>
            </div>
          )}

          {/* Tabs for Bookings and Orders */}
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings'
                      ? 'border-[#EF4F5F] text-[#EF4F5F]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Table Bookings
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders'
                      ? 'border-[#EF4F5F] text-[#EF4F5F]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Food Orders
                </button>
              </nav>
            </div>

            {/* Table Bookings Section */}
            {activeTab === 'bookings' && (
              <div className="mt-8 shadow sm:rounded-lg" style={{ backgroundColor: '#FFEDEF' }}>
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium" style={{ color: 'black' }}>
                    Table Bookings
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  {bookings.length === 0 ? (
                    <div className="px-4 py-5 sm:p-6 text-center" style={{ color: 'black' }}>
                      No bookings yet.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {bookings.map((b) => (
                        <li key={b._id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="sm:flex sm:justify-between w-full">
                              <div>
                                <div className="flex items-center">
                                  <h4 className="text-lg font-medium" style={{ color: 'black' }}>{b.customerName}</h4>
                                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${b.status === 'Confirmed'
                                      ? 'bg-green-100 text-green-800'
                                      : b.status === 'Rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center text-sm" style={{ color: 'black' }}>
                                  <span>Restaurant: {b.restaurantName}</span>
                                  <span className="mx-2">•</span>
                                  <span>Date: {b.date}</span>
                                  <span className="mx-2">•</span>
                                  <span>Guests: {b.guests}</span>
                                </div>
                              </div>
                              <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-2">
                                {b.status !== "Confirmed" && (
                                  <button
                                    onClick={() => updateBookingStatus(b._id, "Confirmed")}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                                    style={{ backgroundColor: '#E03446' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                  >
                                    Approve
                                  </button>
                                )}
                                {b.status !== "Rejected" && (
                                  <button
                                    onClick={() => updateBookingStatus(b._id, "Rejected")}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                                    style={{ backgroundColor: '#E03446' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Food Orders Section */}
            {activeTab === 'orders' && (
              <div className="mt-8 shadow sm:rounded-lg" style={{ backgroundColor: '#FFEDEF' }}>
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium" style={{ color: 'black' }}>
                    Food Orders
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  {orders.length === 0 ? (
                    <div className="px-4 py-5 sm:p-6 text-center" style={{ color: 'black' }}>
                      No orders yet.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <li key={order._id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="sm:flex sm:justify-between w-full">
                              <div>
                                <div className="flex items-center">
                                  <h4 className="text-lg font-medium" style={{ color: 'black' }}>
                                    Order #{order._id.slice(-6)}
                                  </h4>
                                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center text-sm" style={{ color: 'black' }}>
                                  <span>Customer: {order.userId?.name || 'Unknown'}</span>
                                  <span className="mx-2">•</span>
                                  <span>Items: {order.items?.length || 0}</span>
                                  <span className="mx-2">•</span>
                                  <span>Total: ₹{order.totalAmount}</span>
                                </div>
                                <div className="mt-1 text-sm" style={{ color: 'black' }}>
                                  <span>Address: {order.deliveryAddress}</span>
                                </div>
                              </div>
                              <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-2">
                                {order.status === 'confirmed' && (
                                  <button
                                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                                    style={{ backgroundColor: '#E03446' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                  >
                                    Start Preparing
                                  </button>
                                )}
                                {order.status === 'preparing' && (
                                  <button
                                    onClick={() => updateOrderStatus(order._id, 'ready')}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                                    style={{ backgroundColor: '#E03446' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                  >
                                    Mark Ready
                                  </button>
                                )}
                                {order.status === 'ready' && (
                                  <button
                                    onClick={() => updateOrderStatus(order._id, 'out_for_delivery')}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                                    style={{ backgroundColor: '#E03446' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                  >
                                    Out for Delivery
                                  </button>
                                )}
                                {order.status === 'out_for_delivery' && (
                                  <button
                                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF4F5F]"
                                    style={{ backgroundColor: '#E03446' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#BF238B'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#E03446'}
                                  >
                                    Mark Delivered
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
