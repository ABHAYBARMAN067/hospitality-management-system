import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyTable from "./pages/MyTable";
import HotelDetails from "./pages/HotelDetails";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div style={{backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center'}}>
          TEST - App is rendering!
        </div>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mytable" element={<MyTable />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;