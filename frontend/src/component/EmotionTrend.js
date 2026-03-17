import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function EmotionTrend() {

  const [timeline, setTimeline] = useState([]);

  const fetchTimeline = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8080/api/emotion/timeline",
        { withCredentials: true }
      );

      setTimeline(res.data.timeline);

    } catch (error) {

      console.error("Timeline error:", error);

    }

  };

  useEffect(() => {

    fetchTimeline();

    const interval = setInterval(fetchTimeline, 5000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="bg-white shadow-lg rounded-xl p-6">

      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Emotion Detection Trend
      </h3>

      <div className="w-full h-[300px]">

        <ResponsiveContainer>

          <LineChart data={timeline}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="detections"
              stroke="#6366f1"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}