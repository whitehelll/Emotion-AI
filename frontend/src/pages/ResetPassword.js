import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
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
        { password },
      );

      setMessage(res.data.message || "Password updated");

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
    <div
      className="min-h-screen flex items-center justify-center
bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4"
    >
      <div className="w-full max-w-md">
        <div
          className="bg-white/5 backdrop-blur-lg
border border-gray-700
rounded-2xl shadow-2xl p-8 text-white"
        >
          <h1 className="text-3xl font-bold text-center mb-2">
            Reset Password
          </h1>

          <p className="text-center text-gray-400 mb-6">
            Enter your new password
          </p>

          {message && (
            <div
              className="bg-green-500/20 border border-green-500
text-green-400 p-3 rounded-lg mb-4 text-sm"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              className="bg-red-500/20 border border-red-500
text-red-400 p-3 rounded-lg mb-4 text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm">New Password</label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2
-transform -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full mt-2 pl-10 px-4 py-3
bg-black/40 border border-gray-600
rounded-lg outline-none
focus:border-blue-500
focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 text-lg font-semibold
rounded-lg

bg-gradient-to-r
from-blue-500 to-purple-600

hover:from-blue-600
hover:to-purple-700

transition
shadow-lg
active:scale-95
disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
