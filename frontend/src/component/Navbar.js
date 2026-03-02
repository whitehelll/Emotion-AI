import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { LogOutIcon, Menu, X } from "lucide-react";
import useLogout from "../hooks/useLogout.js";
import { getAuthUser } from "../lib/api.js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive ? "text-blue-400" : "text-white hover:text-gray-300"
    }`;
  
  const { logoutMutation, isPending, error } = useLogout();

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
          {!getAuthUser ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>

              <NavLink
                to="/signup"
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <button
              onClick={logoutMutation}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOutIcon size={18} />
              {isPending ? "Logging out..." : "Logout"}
            </button>
          )}
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
          <NavLink
            to="/about"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/home"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>
          <NavLink
            to="/login"
            className={navLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Log in
          </NavLink>
          <NavLink
            to="/signup"
            className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition w-fit"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </NavLink>
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      )}
    </nav>
  );
}



// import { PaletteIcon } from "lucide-react";
// import { useThemeStore } from "../store/useThemeStore";
// import { THEMES } from "../constants";

// const ThemeSelector = () => {
//   const { theme, setTheme } = useThemeStore();

//   return (
//     <div className="dropdown dropdown-end">
//       {/* DROPDOWN TRIGGER */}
//       <button tabIndex={0} className="btn btn-ghost btn-circle">
//         <PaletteIcon className="size-5" />
//       </button>

//       <div
//         tabIndex={0}
//         className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
//         w-56 border border-base-content/10 max-h-80 overflow-y-auto"
//       >
//         <div className="space-y-1">
//           {THEMES.map((themeOption) => (
//             <button
//               key={themeOption.name}
//               className={`
//               w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
//               ${
//                 theme === themeOption.name
//                   ? "bg-primary/10 text-primary"
//                   : "hover:bg-base-content/5"
//               }
//             `}
//               onClick={() => setTheme(themeOption.name)}
//             >
//               <PaletteIcon className="size-4" />
//               <span className="text-sm font-medium">{themeOption.label}</span>
//               {/* THEME PREVIEW COLORS */}
//               <div className="ml-auto flex gap-1">
//                 {themeOption.colors.map((color, i) => (
//                   <span
//                     key={i}
//                     className="size-2 rounded-full"
//                     style={{ backgroundColor: color }}
//                   />
//                 ))}
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ThemeSelector;