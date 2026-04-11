import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";

import EmotionTimelineChart from "../component/charts/EmotionTimelineChart";

export default function Analytics() {

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const res = await axios.get(
          "http://localhost:8080/api/admin/emotion/analytics",
          { withCredentials: true }
        );

        const filtered = (res.data.stats || [])
          .filter(e => e._id && e._id !== "No Face Detected")
          .map(item => ({
            name: item._id,
            value: item.count
          }));

        setStats(filtered);

      } catch (error) {

        console.error(error);

        // 🔐 redirect if not admin / token expired
        window.location.href = "/admin/login";

      } finally {
        setLoading(false);
      }

    };

    fetchAnalytics();

  }, []);

  const COLORS = {
    Happy: "#22c55e",
    Sad: "#3b82f6",
    Angry: "#ef4444",
    Neutral: "#f59e0b",
    Surprise: "#a855f7",
    Disgust: "#06b6d4"
  };

  const renderLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`;

  // ✅ Loading state
  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  // ✅ Empty state
  if (stats.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">No analytics data available</h2>
      </div>
    );
  }

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        Emotion Analytics
      </h2>

      {/* Pie Chart */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8">

        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Emotion Distribution
        </h3>

        <div className="w-full h-[350px]">

          <ResponsiveContainer>

            <PieChart>

              <Pie
                data={stats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={renderLabel}
              >

                {stats.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[entry.name] || "#6366f1"}
                  />
                ))}

              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Trend Chart */}
      <EmotionTimelineChart />

    </div>
  );
}