import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getUserEmotionBreakdown } from "../api/emotion";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#6b7280"
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    try {
      // ✅ CORRECT FUNCTION
      const res = await getUserEmotionBreakdown(user._id);

      console.log("API RESPONSE:", res.data);

      const formatted = res.data.breakdown.map((e) => ({
        name: e.emotion,
        value: e.count,
      }));

      setData(formatted);

    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      <div className="grid grid-cols-2 gap-6">

        {/* USER LIST */}
        <div className="bg-white rounded-xl shadow p-4">

          <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
            <span>Name</span>
            <span>Email</span>
            
          </div>

          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`grid grid-cols-3 p-2 cursor-pointer rounded ${
                selectedUser?._id === user._id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>{user.name}</span>
              <span className="text-sm text-gray-600">{user.email}</span>
              
            </div>
          ))}

        </div>

        {/* PIE CHART */}
        {/* <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">

          <h2 className="font-semibold mb-4">
            {selectedUser
              ? `${selectedUser.name} Emotion Distribution`
              : "Select a user"}
          </h2>

          {data.length === 0 ? (
            <p className="text-gray-400">No data available</p>
          ) : (
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={140}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          )} */}

        {/* </div> */}

      </div>
    </div>
  );
}