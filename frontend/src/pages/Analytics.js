import React, { useEffect, useState } from "react";
import {
  getEmotionAnalytics,
  getEmotionPercentage,
  getUserBreakdown,
} from "../api/emotion";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"];

export default function Analytics() {

  const [percentageData, setPercentageData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      // ✅ Emotion Count
      const analyticsRes = await getEmotionAnalytics();
      const stats = analyticsRes.data.stats;

      const formattedCounts = stats.map(item => ({
        emotion: item._id,
        count: item.count
      }));

      setCountData(formattedCounts);

      // ✅ Percentage
      const percentRes = await getEmotionPercentage();

      const formattedPercent = percentRes.data.data.map(item => ({
        name: item.emotion,
        value: Number(item.percentage)
      }));

      setPercentageData(formattedPercent);

      // ✅ Per User
      const userRes = await getUserBreakdown();

      const formattedUsers = userRes.data.users.map(user => {
        const obj = { name: user.name };

        user.emotions.forEach(e => {
          obj[e.emotion] = e.count;
        });

        return obj;
      });

      setUserData(formattedUsers);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Analytics Dashboard
      </h1>

      {/* ================= PIE CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Emotion Distribution (%)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={percentageData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {percentageData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Emotion Counts
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="emotion" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= STACKED BAR ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Per User Emotion Breakdown
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="Happy" stackId="a" fill="#22c55e" />
            <Bar dataKey="Sad" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Angry" stackId="a" fill="#ef4444" />
            <Bar dataKey="Fear" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Surprise" stackId="a" fill="#a855f7" />
            <Bar dataKey="Neutral" stackId="a" fill="#6366f1" />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}