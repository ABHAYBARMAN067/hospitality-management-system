import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PencilIcon } from "@heroicons/react/24/outline";

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyRestaurant();
    fetchBookings();
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

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-2xl font-bold text-primary-900">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-primary-700">
            Manage your restaurant and bookings
          </p>
        </div>

        <div className="mt-8">
          {/* Add Restaurant Form */}
          {!restaurant ? (
            <div className="bg-primary-100 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-primary-900 mb-4">
                  Add Your Restaurant
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary-700">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-primary-700">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={form.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-primary-700">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contactNumber"
                        id="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-primary-100 text-primary-900 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700">
                      Restaurant Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-primary-400"
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
                        <div className="flex text-sm text-primary-600">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a file</span>
                            <input id="image" name="image" type="file" className="sr-only" onChange={handleChange} accept="image/*" required />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-primary-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Add Restaurant
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-primary-100 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-primary-900">
                  Your Restaurant
                </h3>
              </div>
              <div className="border-t border-primary-200">
                <dl>
                  <div className="bg-primary-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-primary-500">Restaurant name</dt>
                    <dd className="mt-1 text-sm text-primary-900 sm:mt-0 sm:col-span-2">{restaurant.name}</dd>
                  </div>
                  <div className="bg-primary-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-primary-500">Address</dt>
                    <dd className="mt-1 text-sm text-primary-900 sm:mt-0 sm:col-span-2">{restaurant.address}</dd>
                  </div>
                  <div className="bg-primary-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-primary-500">Contact number</dt>
                    <dd className="mt-1 text-sm text-primary-900 sm:mt-0 sm:col-span-2">{restaurant.contactNumber}</dd>
                  </div>
                  <div className="bg-primary-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-primary-500">Email</dt>
                    <dd className="mt-1 text-sm text-primary-900 sm:mt-0 sm:col-span-2">{restaurant.email}</dd>
                  </div>
                  {restaurant.imageUrl && (
                    <div className="bg-primary-200 px-4 py-5 sm:px-6">
                      <dt className="text-sm font-medium text-primary-500 mb-2">Restaurant image</dt>
                      <dd className="mt-1">
                        <img src={restaurant.imageUrl} alt={restaurant.name} className="h-48 w-full object-cover rounded-lg" />
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="px-4 py-4 border-t border-primary-200">
                <button
                  onClick={() => navigate('/menu-management')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Menu
                </button>
              </div>
            </div>
          )}

          {/* Table Bookings Section */}
          <div className="mt-8 bg-primary-100 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-primary-900">
                Table Bookings
              </h3>
            </div>
            <div className="border-t border-primary-200">
              {bookings.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center text-primary-500">
                  No bookings yet.
                </div>
              ) : (
                <ul className="divide-y divide-primary-200">
                  {bookings.map((b) => (
                    <li key={b._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="sm:flex sm:justify-between w-full">
                          <div>
                            <div className="flex items-center">
                              <h4 className="text-lg font-medium text-primary-900">{b.customerName}</h4>
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
                            <div className="mt-2 flex items-center text-sm text-primary-500">
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
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Approve
                              </button>
                            )}
                            {b.status !== "Rejected" && (
                              <button
                                onClick={() => updateBookingStatus(b._id, "Rejected")}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
