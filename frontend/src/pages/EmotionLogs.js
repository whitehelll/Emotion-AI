import React from "react";

export default function EmotionLogs() {

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">
          Emotion Logs
        </h1>
        <p className="text-gray-600">
          Monitor user emotion records
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">

        <table className="min-w-full">

          {/* Table Head */}
          <thead className="bg-indigo-600 text-white">

            <tr>
              <th className="py-3 px-6 text-left">User Name</th>
              <th className="py-3 px-6 text-left">Detected Emotion</th>
              <th className="py-3 px-6 text-left">Confidence</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Time</th>
            </tr>

          </thead>

          {/* Table Body */}
          <tbody className="text-gray-700">

            <tr className="border-b hover:bg-gray-100 transition">

              <td
                colSpan="5"
                className="text-center py-8 text-gray-500 font-medium"
              >
                No emotion logs found
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );
}