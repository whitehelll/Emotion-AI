import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#0c0c0c] border-b border-gray-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-500 to-blue-500"></div>
          <h1 className="text-xl font-bold text-white">
            <Link to="/" className="hover:text-gray-300 transition">Emotion AI</Link>
          </h1>
        </div>

        {/* Center Menu */}
        <ul className="hidden md:flex space-x-10 text-white font-medium">
          <li>
            <Link to="/about" className="hover:text-gray-300 transition">About</Link>
          </li>
          <li>
            <Link to="/home" className="hover:text-gray-300 transition">Home</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-300 transition">Contact</Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-5">
          <Link
            to="/login"
            className="text-white hover:text-gray-300 transition"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            SignUp
          </Link>
        </div>

      </div>
    </nav>
  );
}
