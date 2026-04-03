import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/OnBoarding";
import Chat from "./pages/Chat";
import DashboardLayout from "./component/layout/DashboardLayout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import Navbar from "./component/layout/Navbar.jsx";
import useAuthUser from "./hooks/useAuthUser";
import useAdminAuth from "./hooks/useAdminAuth";
import AdminSignup from "./pages/AdminSignup";
import Home from "./pages/Home";
import VerifyOTP from "./pages/VerifyOTP.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import ResetPassword from "./pages/ResetPassword.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import AdminRoute from "./routes/AdminRoute.jsx";
import EmotionLogs from "./pages/EmotionLogs.js";

import Analytics from "./pages/Analytics.js";
import AdminLogin from "./pages/AdminLogin.js";
import AdminUsers from "./pages/AdminUsers.js";
import GlobalAnalytics from "./pages/GlobalAnalytics.js";
import TimelinePage from "./pages/TimelinePage.js";

const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const { admin, loading: adminLoading } = useAdminAuth();

  const { theme } = useThemeStore();

  if (isLoading || adminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const isAuthenticated = Boolean(authUser);
  const isAdminAuthenticated = Boolean(admin);
  const isOnboard = authUser?.isOnboard ?? false;

  return (
    <div className="min-h-screen" data-theme={theme}>
      {/* Hide Navbar for Admin */}
      {!isAdminAuthenticated && <Navbar />}

      <Routes>
        <Route path="users" element={<AdminUsers />} />
        <Route path="global" element={<GlobalAnalytics />} />
        <Route path="timeline" element={<TimelinePage />} />

        <Route path="/" element={<Landing />} />

        {/* ===== USER AUTH ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ADMIN AUTH */}
        <Route path="/admin-signup" element={<AdminSignup />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ================= ADMIN LOGIN ================= */}
        {/* <Route path="/admin-login" element={<Login />} /> */}
        <Route path="/admin/analytics" element={<AdminRoute>...</AdminRoute>} />

        {/* ================= PUBLIC ================= */}

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= PASSWOFRD ================= */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= AUTH ================= */}
        {/* <Route
          path="/login"
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin/dashboard" />
            ) : isAuthenticated ? (
              <Navigate to={isOnboard ? "/" : "/onboarding"} />
            ) : (
              <Login />
            )
          }
        /> */}

        {/* <Route
          path="/signup"
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin/dashboard" />
            ) : isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <SignUp />
            )
          }
        /> */}

        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* ================= USER ROUTES ================= */}

        {/* <Route
          path="/"
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin/dashboard" />
            ) : isAuthenticated && isOnboard ? (
              <Home />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        /> */}

        <Route
          path="/onboarding"
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin/dashboard" />
            ) : isAuthenticated ? (
              !isOnboard ? (
                <Onboarding />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/chat"
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <AdminRoute>
              <DashboardLayout>
                <EmotionLogs />
              </DashboardLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </AdminRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;