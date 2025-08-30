export default function HotelCard({ name, location, price, image }) {
    return (
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
  
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-600">{location}</p>
          <p className="text-red-600 font-bold mt-2">₹{price} / night</p>
  
          <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full">
            Book Now
          </button>
        </div>
      </div>
    );
  }
  