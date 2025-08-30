import React from "react";

const AdminDashboard = () => {
  const bookings = [
    { id: 1, user: "John Doe", hotel: "The Taj", status: "Confirmed" },
    { id: 2, user: "Jane Smith", hotel: "Oberoi", status: "Pending" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mb-2">Manage Bookings</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="border p-4 rounded-xl shadow-md flex justify-between items-center"
          >
            <div>
              <p>User: {b.user}</p>
              <p>Hotel: {b.hotel}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-white ${
                b.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
