export default function Sidebar({ active, setActive }) {
  const menu = [
    { name: "dashboard", label: "Dashboard" },
    { name: "users", label: "Users" },
    { name: "logs", label: "Emotion Logs" },
    { name: "analytics", label: "Analytics" },
  ];

  return (
    <div className="w-64 bg-[#0b1a33] text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-blue-900 text-xl font-semibold">
        Emotion AI
      </div>

      {/* Menu */}
      <ul className="flex-1 mt-2">
        {menu.map((item) => (
          <li
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`px-6 py-4 cursor-pointer transition-all
            ${
              active === item.name
                ? "bg-blue-600 rounded-md mx-2"
                : "hover:bg-blue-900"
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="p-6 border-t border-blue-900 cursor-pointer hover:text-red-400">
        Logout
      </div>

    </div>
  );
}