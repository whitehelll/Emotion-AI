import React from "react";

export default function Dashboard() {

  return (

    <div>

      <h1>Dashboard</h1>
      <p>Emotion Monitoring Overview</p>

      <div className="cards">

        <div className="card">
          <h3>Total Records</h3>
          <h1>0</h1>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <h1>0</h1>
        </div>

        <div className="card">
          <h3>Most Common</h3>
          <h1>N/A</h1>
        </div>

      </div>

    </div>

  );
}