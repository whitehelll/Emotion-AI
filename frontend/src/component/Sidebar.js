import React from "react";
import "./dashboard.css";

export default function Sidebar({ active, setActive }) {
  return (
    <div className="sidebar">

      <div className="logo">
        <h2>Doctor Dashboard</h2>
        <p>Emotion Monitoring</p>
      </div>

      <ul>

        <li
          className={active === "dashboard" ? "active" : ""}
          onClick={() => setActive("dashboard")}
        >
          Dashboard
        </li>

        <li
          className={active === "users" ? "active" : ""}
          onClick={() => setActive("users")}
        >
          Users
        </li>

        <li
          className={active === "logs" ? "active" : ""}
          onClick={() => setActive("logs")}
        >
          Emotion Logs
        </li>

        <li
          className={active === "analytics" ? "active" : ""}
          onClick={() => setActive("analytics")}
        >
          Analytics
        </li>

      </ul>

      <div className="logout">
        Logout
      </div>

    </div>
  );
}