import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600">
        <Link to="/">Logo</Link>
      </div>

      {/* Menu Items */}
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li><Link to="/" className="hover:text-red-600">Home</Link></li>
        <li><Link to="/about" className="hover:text-red-600">About</Link></li>
        <li><Link to="/services" className="hover:text-red-600">Services</Link></li>
        {user && (
          <li><Link to="/mytable" className="hover:text-red-600">MyTable</Link></li>
        )}
        <li><Link to="/admin-signup" className="hover:text-red-600">Admin Signup</Link></li>
      </ul>

      {/* Login / Signup or User Info */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">Welcome, {user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
}
