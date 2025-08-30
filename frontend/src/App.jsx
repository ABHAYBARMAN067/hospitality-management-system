import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HotelCard from "./components/HotelCard";

function App() {
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <HotelCard 
          name="Taj Palace" 
          location="Delhi" 
          price="4500" 
          image="https://source.unsplash.com/400x300/?hotel,room"
        />
        <HotelCard 
          name="Oberoi Hotel" 
          location="Mumbai" 
          price="6000" 
          image="https://source.unsplash.com/400x300/?resort,hotel"
        />
      </div>
      <Footer />
    </>
  );
}

export default App;
