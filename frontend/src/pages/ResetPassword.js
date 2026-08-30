import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `http://localhost:8080/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message || "Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 text-white font-sans">

      {/* 🔥 Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1526378722484-bd91ca387e72"
          alt="secure"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-black"></div>
      </div>

      {/* 🔥 Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-[#7cc0ff]">
            Reset Password
          </h1>

          <p className="text-center text-gray-400 mb-6 text-sm">
            Create a strong new password for your account
          </p>

          {/* Success */}
          {message && (
            <div className="bg-green-500/10 border border-green-500/40 text-green-400 p-3 rounded-lg mb-4 text-sm text-center">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Password */}
            <div>
              <label className="text-gray-300 text-sm">New Password</label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-2 pl-10 pr-10 px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                  outline-none transition"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password hint */}
              <p className="text-xs text-gray-500 mt-2">
                Use at least 8 characters with a mix of letters & numbers
              </p>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full py-3 text-lg font-semibold rounded-lg
              bg-gradient-to-r from-blue-500 to-purple-600
              hover:from-blue-600 hover:to-purple-700
              transition-all duration-300 shadow-lg
              hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>

            {/* Back */}
            <p className="text-center text-gray-400 text-sm">
              Remember your password?
              <Link
                to="/login"
                className="ml-1 text-blue-400 hover:text-blue-300"
              >
                Back to Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;