  import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [totalLogs, setTotalLogs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [topEmotion, setTopEmotion] = useState("N/A");

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const analytics = await axios.get(
          "http://localhost:8080/api/emotion/analytics",
          { withCredentials: true }
        );

        const users = await axios.get(
          "http://localhost:8080/api/users",
          { withCredentials: true }
        );

        const stats = analytics.data.stats;

        let total = 0;

        stats.forEach(e => {
          total += e.count;
        });

        setTotalLogs(total);
        setTotalUsers(users.data.users.length);

        if (stats.length > 0) {
          setTopEmotion(stats[0]._id);
        }

      } catch (error) {
        console.log(error);
      }

    };

    fetchDashboard();

  }, []);

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold text-indigo-700 mb-2">
        Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Emotion Monitoring Overview
      </p>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-indigo-500">
          <h3 className="text-gray-500 text-sm">Total Emotion Logs</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {totalLogs}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {totalUsers}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm">Most Common Emotion</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {topEmotion}
          </p>
        </div>

      </div>

      {/* Insights Section */}

      <div className="mt-10 grid md:grid-cols-2 gap-6">

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Emotion Insights
          </h2>

          <p className="text-gray-500">
            Monitor emotional behavior patterns and analyze mood trends across users.
          </p>

        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            AI Monitoring Status
          </h2>

          <p className="text-gray-500">
            Emotion detection service is running and collecting real-time data.
          </p>

        </div>

      </div>

    </div>

  );

}