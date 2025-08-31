import React from "react";
import HotelCard from "../components/HotelCard";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Table Booking</h1>
      <p className="mb-6 text-gray-600">Find and book tables at the best hotels easily.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HotelCard 
          name="The Taj" 
          location="Mumbai" 
          price="4500"
          image="https://source.unsplash.com/400x300/?hotel,room"
        />
        <HotelCard 
          name="Oberoi Hotel" 
          location="Delhi" 
          price="6000"
          image="https://source.unsplash.com/400x300/?resort,hotel"
        />
        <HotelCard 
          name="Leela Palace" 
          location="Bangalore" 
          price="5500"
          image="https://source.unsplash.com/400x300/?luxury,hotel"
        />
      </div>
    </div>
  );
};

export default Home;
