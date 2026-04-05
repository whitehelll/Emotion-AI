import { useState } from "react";
import useAnalytics from "../hooks/useAnalytics";

import StatsCards from "../component/dashboard/StatsCards";
import UserTable from "../component/dashboard/UserTable";
import UserGrowthChart from "../component/charts/UserGrowthChart";
import EmotionPieChart from "../component/charts/EmotionPieChart";

export default function AdminDashboard() {
const [selectedUser, setSelectedUser] = useState(null);

const { users, growth, emotions, loading } =
useAnalytics(selectedUser?._id);

if (loading) return <p className="text-white">Loading...</p>;

return ( <div className="p-6 bg-gray-900 min-h-screen">

  <h1 className="text-2xl font-bold text-white mb-6">
    Admin Dashboard
  </h1>

  {/* ✅ Stats */}
  <StatsCards users={users} />

  {/* ✅ Charts */}
  <div className="grid md:grid-cols-2 gap-6 mb-6">
    <UserGrowthChart data={growth} />
    <EmotionPieChart data={emotions} />
  </div>

  {/* ✅ Users */}
  <UserTable
    users={users.filter(u => u.role !== "admin")}
    onSelectUser={setSelectedUser}
  />

  {/* ✅ Selected User */}
  {selectedUser && (
    <div className="mt-6 text-white">
      <h2 className="text-xl">
        Selected: {selectedUser.name}
      </h2>
    </div>
  )}

</div>


);
}
