import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive ? "text-blue-400" : "text-white hover:text-gray-300"
    }`;

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-500 to-blue-500"></div>
          <h1 className="text-xl font-bold text-white">
            <Link to="/" className="hover:text-gray-300 transition">
              Emotion AI
            </Link>
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10 font-medium">
          <li>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/home" className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-5">
          <NavLink to="/login" className={navLinkClass}>
            Log in
          </NavLink>

          <NavLink
            to="/signup"
            className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            Sign Up
          </NavLink>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-4 text-white font-medium px-2">
          <NavLink to="/about" className={navLinkClass} onClick={() => setIsOpen(false)}>About</NavLink>
          <NavLink to="/home" className={navLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/contact" className={navLinkClass} onClick={() => setIsOpen(false)}>Contact</NavLink>
          <NavLink to="/login" className={navLinkClass} onClick={() => setIsOpen(false)}>Log in</NavLink>
          <NavLink
            to="/signup"
            className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition w-fit"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </NavLink>
        </div>
      )}
    </nav>
  );
}