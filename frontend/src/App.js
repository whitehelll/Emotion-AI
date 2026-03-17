import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/OnBoarding";
import StartChat from "./pages/StartChat";
import Chat from "./pages/Chat";
import DashboardLayout from "./component/DashboardLayout";
import { useThemeStore } from "./store/useThemeStore.js";
import Navbar from "./component/Navbar";
import useAuthUser from "./hooks/useAuthUser";
import Home from "./pages/Home";
import VerifyOTP from "./pages/VerifyOTP.js";
import About from "./pages/About.js"
import Contact from "./pages/Contact.js" 
import ForgotPassword from "./pages/ForgotPassword.js";
import ResetPassword from "./pages/ResetPassword.js";

const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const isOnboard = authUser?.isOnboard ?? false;
  const { theme, setTheme } = useThemeStore();


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const isAuthenticated = Boolean(authUser);
  console.log(authUser);
  

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Navbar />
      <Routes>
        {/*Forgot Password*/}

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Landing */}
        <Route path="/landing" element={<Landing />} />

        {/* Home */}

        <Route
          path="/"
          element={
            isAuthenticated && isOnboard ? (
              <Home />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to={isOnboard ? "/" : "/onboarding"} />
            )
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUp />
            ) : (
              <Navigate to={isOnboard ? "/" : "/onboarding"} />
            )
          }
        />

        {/* Onboarding */}

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
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

        {/* Start Page */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && isOnboard ? (
              <DashboardLayout />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        {/* Chat */}
        <Route
          path="/chat"
          element={
            isAuthenticated && isOnboard ? (
              <Chat />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;