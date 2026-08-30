import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";

const AdminSignup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/admin-auth/signup", data);

      navigate("/verify-otp", {
        state: {
          email: res.data.email,
          role: "admin",
          isAdmin: true,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 text-white font-sans">

      {/* 🔥 Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475"
          alt="secure"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#020617]/95 to-[#020617]"></div>
      </div>

      {/* 🔥 Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-3xl shadow-2xl p-8">

          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="text-red-400" size={22} />
            <h2 className="text-3xl font-bold text-red-400">
              Admin Registration
            </h2>
          </div>

          <p className="text-center text-gray-400 mb-6">
            Create a secure admin account
          </p>

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                required
                placeholder="Admin Name"
                value={data.name}
                onChange={(e) =>
                  setData({ ...data, name: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-lg
                bg-white/5 border border-white/10
                focus:border-red-500 focus:ring-2 focus:ring-red-500/30
                outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, email: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-lg
                bg-white/5 border border-white/10
                focus:border-red-500 focus:ring-2 focus:ring-red-500/30
                outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className="w-full mt-2 px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  focus:border-red-500 focus:ring-2 focus:ring-red-500/30
                  outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full py-3 text-lg font-semibold rounded-lg
              bg-gradient-to-r from-red-500 to-pink-600
              hover:from-red-600 hover:to-pink-700
              transition-all duration-300 shadow-lg
              hover:shadow-red-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>

            {/* Login redirect */}
            <p className="text-center text-gray-400 text-sm">
              Already an admin?
              <Link
                to="/admin-login"
                className="ml-1 text-red-400 hover:text-red-300"
              >
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;