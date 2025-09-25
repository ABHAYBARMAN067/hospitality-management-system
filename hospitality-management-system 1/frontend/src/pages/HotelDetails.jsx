import React from "react";
import { useParams } from "react-router-dom";

const HotelDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Hotel Details - {id}</h1>
      <p className="mb-4">Photos, Address, Top Dishes and Table Availability</p>

      {/* Placeholder for tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border p-4 rounded-xl shadow-md">
          <h2 className="font-semibold mb-2">Table 1</h2>
          <p>Seats: 4</p>
          <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Book
          </button>
        </div>
        <div className="border p-4 rounded-xl shadow-md">
          <h2 className="font-semibold mb-2">Table 2</h2>
          <p>Seats: 2</p>
          <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
