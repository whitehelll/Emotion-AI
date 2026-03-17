import React, { useState, lazy, Suspense } from "react";
import Sidebar from "./Sidebar";

// Lazy loaded pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Users = lazy(() => import("../pages/Users"));
const EmotionLogs = lazy(() => import("../pages/EmotionLogs"));
const Analytics = lazy(() => import("../pages/Analytics"));

export default function DashboardLayout() {
  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {
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
    <div className="flex h-screen w-full">

      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-10 overflow-y-auto">
        <Suspense fallback={<div className="text-center text-lg mt-20">Loading...</div>}>
          {renderPage()}
        </Suspense>
      </div>

    </div>
  );
}