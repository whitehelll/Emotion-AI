import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    //{ name: "Emotion Logs", path: "/admin/logs" },
    { name: "Analytics", path: "/admin/analytics" },
    //{ name: "TimeLine", path: "/admin/timeline" },
 
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white border-r p-5 shadow-md z-50">

      <h1 className="text-2xl font-bold mb-8 text-blue-600">
        Doctor Dashboard
      </h1>

      <div className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === item.path
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-5 left-5 text-gray-500 text-sm">
        Admin Panel
      </div>

    </div>
  );
}