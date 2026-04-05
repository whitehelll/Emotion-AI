import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/axios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const isAdmin = location.state?.isAdmin;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Prevent direct access
  if (!email) {
    navigate("/signup");
    return null;
  }

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const themeColor = isAdmin ? "red" : "blue";

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 text-white font-sans">

      {/* 🔥 Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72"
          alt="otp"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#020617]/90 to-[#020617]"></div>
      </div>

      {/* 🔥 Card */}
      <div className="relative w-full max-w-md">
        <div className={`bg-white/5 backdrop-blur-xl border rounded-3xl shadow-2xl p-8 ${
          isAdmin ? "border-red-500/20" : "border-white/10"
        }`}>

          {/* Title */}
          <h2 className={`text-3xl font-bold text-center mb-2 ${
            isAdmin ? "text-red-400" : "text-[#7cc0ff]"
          }`}>
            Verify Email
          </h2>

          <p className="text-center text-gray-400 mb-6 text-sm">
            Enter the OTP sent to <br />
            <span className="text-white font-medium">{email}</span>
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={verifyOTP} className="space-y-6">

            {/* OTP INPUT */}
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className={`w-full text-center text-xl tracking-widest px-4 py-3 rounded-lg
              bg-white/5 border border-white/10
              focus:ring-2 outline-none transition ${
                isAdmin
                  ? "focus:border-red-500 focus:ring-red-500/30"
                  : "focus:border-blue-500 focus:ring-blue-500/30"
              }`}
            />

            {/* Button */}
            <button
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold rounded-lg
              transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 ${
                isAdmin
                  ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Back */}
            <p className="text-center text-gray-400 text-sm">
              Didn’t receive code?
              <Link
                to={isAdmin ? "/admin-signup" : "/signup"}
                className={`ml-1 ${
                  isAdmin ? "text-red-400" : "text-blue-400"
                } hover:underline`}
              >
                Go Back
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;