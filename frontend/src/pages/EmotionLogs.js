import React from "react";

export default function EmotionLogs() {

  return (

    <div>

      <h1>Emotion Logs</h1>
      <p>Monitor user emotion records</p>

      <div className="table">

        <table>

          <thead>

            <tr>
              <th>User Name</th>
              <th>Detected Emotion</th>
              <th>Confidence</th>
              <th>Date</th>
              <th>Time</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td colSpan="5" className="empty">
                No emotion logs found
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );
}