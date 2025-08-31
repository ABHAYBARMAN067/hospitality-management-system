export default function HotelCard({ hotel, onSelect }) {
    const { name, location, address, price, image, topDishes, rating } = hotel;
    
    return (
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition cursor-pointer" onClick={onSelect}>
        <img src={image} alt={name} className="w-full h-48 object-cover" />
  
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
            <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
              ⭐ {rating}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{address}</p>
          
          <div className="mb-3">
            <p className="text-sm text-gray-500 mb-1">Top Dishes:</p>
            <div className="flex flex-wrap gap-1">
              {topDishes.map((dish, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {dish}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-red-600 font-bold">₹{price} / table</p>
  
          <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full">
            View Details & Book
          </button>
        </div>
      </div>
    );
  }
  