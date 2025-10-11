// // frontend/src/pages/AdminDashboard.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AdminDashboard = () => {
//   const [restaurants, setRestaurants] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     address: "",
//     contactNumber: "",
//     email: "",
//     image: null,
//   });

//   const token = localStorage.getItem("token"); // ✅ token login ke baad localStorage me store hona chahiye

//   // Restaurants fetch
//   useEffect(() => {
//     fetchRestaurants();
//   }, []);

//   const fetchRestaurants = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/admin/my-restaurants",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setRestaurants(res.data);
//     } catch (err) {
//       console.error("Error fetching restaurants:", err.response?.data || err.message);
//     }
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setForm({ ...form, [name]: files[0] });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   // Submit form (Add Restaurant)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = new FormData();
//       Object.keys(form).forEach((key) => {
//         data.append(key, form[key]);
//       });

//       await axios.post("http://localhost:5000/api/admin/restaurants", data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("✅ Restaurant added successfully!");
//       setForm({
//         name: "",
//         address: "",
//         contactNumber: "",
//         email: "",
//         image: null,
//       });
//       fetchRestaurants();
//     } catch (err) {
//       console.error("Error adding restaurant:", err.response?.data || err.message);
//       alert("❌ Failed to add restaurant");
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

//       {/* Add Restaurant Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="mb-8 space-y-4 border bg-white p-6 rounded-lg shadow-md"
//       >
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">
//           ➕ Add New Restaurant
//         </h3>
//         <input
//           type="text"
//           name="name"
//           placeholder="Restaurant Name"
//           value={form.name}
//           onChange={handleChange}
//           className="border p-3 w-full rounded-md"
//           required
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           value={form.address}
//           onChange={handleChange}
//           className="border p-3 w-full rounded-md"
//           required
//         />
//         <input
//           type="text"
//           name="contactNumber"
//           placeholder="Contact Number"
//           value={form.contactNumber}
//           onChange={handleChange}
//           className="border p-3 w-full rounded-md"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="border p-3 w-full rounded-md"
//           required
//         />
//         <input
//           type="file"
//           name="image"
//           onChange={handleChange}
//           className="border p-3 w-full rounded-md"
//           accept="image/*"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           Add Restaurant
//         </button>
//       </form>

//       {/* Restaurants List */}
//       <h3 className="text-2xl font-semibold mb-4 text-gray-800">
//         📋 My Restaurants
//       </h3>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {restaurants.length === 0 ? (
//           <p className="text-gray-500">No restaurants added yet.</p>
//         ) : (
//           restaurants.map((r) => (
//             <div
//               key={r._id}
//               className="border rounded-lg shadow-md bg-white p-4 flex flex-col items-center text-center"
//             >
//               {r.imageUrl && (
//                 <img
//                   src={r.imageUrl}
//                   alt={r.name}
//                   className="w-28 h-28 object-cover rounded-md mb-3"
//                 />
//               )}
//               <h4 className="font-bold text-lg text-gray-700">{r.name}</h4>
//               <p className="text-sm text-gray-600">{r.address}</p>
//               <p className="text-sm text-gray-600">{r.contactNumber}</p>
//               <p className="text-sm text-gray-600">{r.email}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      {/* Add Restaurant Form */}
      {!restaurant ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4 border bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">➕ Add Your Restaurant</h3>
          <input type="text" name="name" placeholder="Restaurant Name" value={form.name} onChange={handleChange} className="border p-3 w-full rounded-md" required />
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-3 w-full rounded-md" required />
          <input type="text" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="border p-3 w-full rounded-md" required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-3 w-full rounded-md" required />
          <input type="file" name="image" onChange={handleChange} className="border p-3 w-full rounded-md" accept="image/*" required />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Add Restaurant
          </button>
        </form>
      ) : (
        <div className="mb-8 border p-6 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-semibold mb-2">🏨 Your Restaurant</h3>
          <p className="font-bold">{restaurant.name}</p>
          <p>{restaurant.address}</p>
          <p>{restaurant.contactNumber}</p>
          <p>{restaurant.email}</p>
          {restaurant.imageUrl && <img src={restaurant.imageUrl} alt={restaurant.name} className="w-32 h-32 object-cover rounded-md mt-2" />}
        </div>
      )}

      {/* Table Bookings Section */}
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4">📅 Table Bookings</h3>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="border p-3 rounded-md flex justify-between items-center">
                <div>
                  <p><strong>Name:</strong> {b.customerName}</p>
                  <p><strong>Date:</strong> {b.date}</p>
                  <p><strong>Guests:</strong> {b.guests}</p>
                </div>
                <div className="flex gap-2">
                  <p className={`font-bold ${b.status === "Confirmed" ? "text-green-600" : "text-yellow-600"}`}>{b.status}</p>
                  {b.status !== "Confirmed" && (
                    <button
                      onClick={() => updateBookingStatus(b._id, "Confirmed")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {b.status !== "Rejected" && (
                    <button
                      onClick={() => updateBookingStatus(b._id, "Rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
