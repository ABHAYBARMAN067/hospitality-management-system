import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CitySelection from "../components/CitySelection";
import HotelList from "../components/HotelList";
import HotelDetails from "../components/HotelDetails";
import BookingConfirmation from "../components/BookingConfirmation";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('city'); // city, hotels, details, confirmation
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentStep('hotels');
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setCurrentStep('details');
  };

  const handleTableSelect = (tableData) => {
    const details = {
      ...tableData,
      hotelName: selectedHotel.name,
      hotelId: selectedHotel.id
    };
    setBookingDetails(details);
    setCurrentStep('confirmation');
  };

  const handleBackToHotels = () => {
    setCurrentStep('hotels');
  };

  const handleBackToDetails = () => {
    setCurrentStep('details');
  };

  const handleConfirmBooking = (details) => {
    // Here you would typically save to database
    alert('Booking confirmed successfully! You can view it in MyTable section.');
    // Reset to city selection
    setCurrentStep('city');
    setSelectedCity('');
    setSelectedHotel(null);
    setBookingDetails(null);
  };

  const handleSkipLogin = () => {
    setCurrentStep('city');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Render different components based on current step
  switch (currentStep) {
    case 'city':
      return (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Table Booking</h1>
            <p className="text-xl text-gray-600 mb-6">Find and book tables at the best hotels easily</p>
            {!user && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLoginClick}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={handleSkipLogin}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Browse as Guest
                </button>
              </div>
            )}
          </div>
          <CitySelection onCitySelect={handleCitySelect} />
        </div>
      );

    case 'hotels':
      return (
        <HotelList 
          city={selectedCity} 
          onHotelSelect={handleHotelSelect}
        />
      );

    case 'details':
      return (
        <HotelDetails 
          hotel={selectedHotel}
          onBack={handleBackToHotels}
          onTableSelect={handleTableSelect}
        />
      );

    case 'confirmation':
      return (
        <BookingConfirmation 
          bookingDetails={bookingDetails}
          onBack={handleBackToDetails}
          onConfirm={handleConfirmBooking}
        />
      );

    default:
      return <CitySelection onCitySelect={handleCitySelect} />;
  }
};

export default Home;
