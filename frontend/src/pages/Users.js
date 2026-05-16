import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/admin/users", { withCredentials: true })
      .then(res => setUsers(res.data.users))
      .catch(() => window.location.href = "/admin/login");
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <input
        placeholder="Search user..."
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border"
      />

      {filtered.map(u => (
        <div key={u._id}>{u.name}</div>
      ))}

    </div>
  );
}