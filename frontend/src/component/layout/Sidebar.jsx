import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
const { pathname } = useLocation();

const linkClass = (path) =>
`block p-3 rounded ${
      pathname === path ? "bg-blue-600" : "hover:bg-gray-700"
    }`;

return ( <div className="w-60 bg-gray-900 text-white min-h-screen p-4">


  <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

  <Link to="/admin/users" className={linkClass("/admin/users")}>
    Users
  </Link>

  <Link to="/admin/global" className={linkClass("/admin/global")}>
    Global Emotions
  </Link>

  <Link to="/admin/timeline" className={linkClass("/admin/timeline")}>
    Timeline
  </Link>

</div>

);
}
