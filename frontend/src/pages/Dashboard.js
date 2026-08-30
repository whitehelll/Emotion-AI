//   import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Dashboard() {

//   const [totalLogs, setTotalLogs] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [topEmotion, setTopEmotion] = useState("N/A");

//   useEffect(() => {

//     const fetchDashboard = async () => {

//       try {

//         const analytics = await axios.get(
//           "http://localhost:8080/api/emotion/analytics",
//           { withCredentials: true }
//         );

//         const users = await axios.get(
//           "http://localhost:8080/api/users",
//           { withCredentials: true }
//         );

//         const stats = analytics.data.stats;

//         let total = 0;

//         stats.forEach(e => {
//           total += e.count;
//         });

//         setTotalLogs(total);
//         setTotalUsers(users.data.users.length);

//         if (stats.length > 0) {
//           setTopEmotion(stats[0]._id);
//         }

//       } catch (error) {
//         console.log(error);
//       }

//     };

//     fetchDashboard();

//   }, []);

//   return (

//     <div className="p-6 bg-gray-50 min-h-screen">

//       <h1 className="text-3xl font-bold text-indigo-700 mb-2">
//         Dashboard
//       </h1>

//       <p className="text-gray-600 mb-8">
//         Emotion Monitoring Overview
//       </p>

//       {/* Stats Cards */}

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-indigo-500">
//           <h3 className="text-gray-500 text-sm">Total Emotion Logs</h3>
//           <p className="text-3xl font-bold text-indigo-600 mt-2">
//             {totalLogs}
//           </p>
//         </div>

//         <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500">
//           <h3 className="text-gray-500 text-sm">Total Users</h3>
//           <p className="text-3xl font-bold text-green-600 mt-2">
//             {totalUsers}
//           </p>
//         </div>

//         <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-orange-500">
//           <h3 className="text-gray-500 text-sm">Most Common Emotion</h3>
//           <p className="text-3xl font-bold text-orange-500 mt-2">
//             {topEmotion}
//           </p>
//         </div>

//       </div>

//       {/* Insights Section */}

//       <div className="mt-10 grid md:grid-cols-2 gap-6">

//         <div className="bg-white shadow-lg rounded-xl p-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-3">
//             Emotion Insights
//           </h2>

//           <p className="text-gray-500">
//             Monitor emotional behavior patterns and analyze mood trends across users.
//           </p>

//         </div>

//         <div className="bg-white shadow-lg rounded-xl p-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-3">
//             AI Monitoring Status
//           </h2>

//           <p className="text-gray-500">
//             Emotion detection service is running and collecting real-time data.
//           </p>

//         </div>

//       </div>

//     </div>

//   );

// }

import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../component/StatCard";

export default function Dashboard() {
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topEmotion, setTopEmotion] = useState("N/A");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get("/api/emotion/analytics"), // ✅ FIXED
        api.get("/api/users"), // ✅ FIXED
      ]);

      const stats = analyticsRes?.data?.stats || [];

      console.log("DASHBOARD STATS:", stats); // 🔍 debug

      // ✅ total logs
      const total = stats.reduce((acc, cur) => acc + cur.count, 0);
      setTotalLogs(total);

      // ✅ total users
      setTotalUsers(usersRes?.data?.users?.length || 0);

      // ✅ top emotion
      setTopEmotion(stats.length > 0 ? stats[0]._id : "N/A");

    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor user emotions and system insights
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Emotion Logs" value={totalLogs} />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Most Common Emotion" value={topEmotion} />
      </div>

      {/* INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Emotion Insights
          </h2>

          <p className="text-gray-500 leading-relaxed">
            Track emotional patterns across users and identify behavioral trends.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            AI Monitoring Status
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-600">
              Emotion detection system is active
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}