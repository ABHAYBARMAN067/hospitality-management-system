import React from "react";
import HotelCard from "../components/HotelCard";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Table Booking</h1>
      <p className="mb-6">Find and book tables at the best hotels easily.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HotelCard name="The Taj" location="Mumbai" rating={4.8} />
        <HotelCard name="Oberoi Hotel" location="Delhi" rating={4.6} />
        <HotelCard name="Leela Palace" location="Bangalore" rating={4.7} />
      </div>
    </div>
  );
};

export default Home;
