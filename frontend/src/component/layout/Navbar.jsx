import { Link } from "react-router-dom";
import useAdminAuth from "../../hooks/useAdminAuth";

export default function Navbar() {

  const { admin } = useAdminAuth();
  const isAdmin = Boolean(admin);

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">

      <h1 className="font-bold">Dashboard</h1>

      <div className="flex gap-4">

        {/* Admin-only link */}
        {isAdmin && (
          <Link to="/admin/analytics">Analytics</Link>
        )}

        {/* Optional: show admin label */}
        {isAdmin && <span>Admin</span>}

      </div>

    </div>
  );
}