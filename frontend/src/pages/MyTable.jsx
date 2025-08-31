import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MyTable = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to login
  }

  const bookings = [
    { id: 1, hotel: "The Taj", date: "2025-09-01", status: "Confirmed" },
    { id: 2, hotel: "Oberoi Hotel", date: "2025-09-05", status: "Pending" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Table Bookings</h1>
      <p className="text-gray-600 mb-6">Welcome back, {user.name || user.email}!</p>

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="border p-4 rounded-xl shadow-md flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{b.hotel}</h2>
              <p>Date: {b.date}</p>
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

export default MyTable;
