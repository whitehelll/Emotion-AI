import React, { useState } from "react";
import Sidebar from "./Sidebar.js";

import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import EmotionLogs from "../pages/EmotionLogs";
import Analytics from "../pages/Analytics";
import "./dashboard.css";

export default function DashboardLayout() {

  const [active, setActive] = useState("dashboard");

  const renderPage = () => {

    switch (active) {

      case "dashboard":
        return <Dashboard />;

      case "users":
        return <Users />;

      case "logs":
        return <EmotionLogs />;

      case "analytics":
        return <Analytics />;

      default:
        return <Dashboard />;
    }
  };

  return (

    <div className="dashboard-container">

      <Sidebar active={active} setActive={setActive}/>

      <div className="main-content">
        {renderPage()}
      </div>

    </div>

  );
}