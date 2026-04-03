import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const isAdmin = location.state?.isAdmin;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // 🔥 Prevent direct access
  if (!email) {
    navigate("/signup");
    return null;
  }

  const verifyOTP = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        isAdmin
          ? "/api/admin-auth/verify-otp"
          : "/api/auth/verify-otp",
        { email, otp }
      );

      alert("Email Verified");

      navigate(isAdmin ? "/admin-login" : "/login");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={verifyOTP} className="p-6 bg-gray-900 rounded-lg">
        <h2 className="text-xl mb-4">Verify Email</h2>

        {error && <p className="text-red-400">{error}</p>}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 mb-3 bg-gray-800"
        />

        <button className="w-full bg-blue-500 p-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;