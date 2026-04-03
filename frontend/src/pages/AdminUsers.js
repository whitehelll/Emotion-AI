import { useState } from "react";
import useAnalytics from "../hooks/useAnalytics";
import UserTable from "../component/dashboard/UserTable";
import EmotionPieChart from "../component/charts/EmotionPieChart";
import EmotionTimelineChart from "../component/charts/EmotionTimelineChart";

export default function AdminUsers() {
const [selectedUser, setSelectedUser] = useState(null);

const { users, emotions, timeline } =
useAnalytics(selectedUser?._id);

return ( <div>

  <h1 className="text-white text-xl mb-4">Users</h1>

  <UserTable
    users={users}
    onSelectUser={setSelectedUser}
  />

  {selectedUser && (
    <div className="mt-6">

      <h2 className="text-white mb-2">
        {selectedUser.name}'s Analytics
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <EmotionPieChart data={emotions} />
        <EmotionTimelineChart data={timeline} />
      </div>

    </div>
  )}

</div>

);
}
