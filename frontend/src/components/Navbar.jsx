import { Link } from "react-router-dom";

export default function Navbar() {
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
        <li><Link to="/mytable" className="hover:text-red-600">MyTable</Link></li>
      </ul>

      {/* Login / Signup */}
      <div>
        <Link
          to="/login"
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Login / Signup
        </Link>
      </div>
    </nav>
  );
}
