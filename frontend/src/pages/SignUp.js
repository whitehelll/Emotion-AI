import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/signup", data);

      navigate("/verify-otp", {
        state: { email: res.data.email, isAdmin: false },
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
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          alt="bg"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-black"></div>
      </div>

      {/* 🔥 Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-[#7cc0ff]">
            Create Account
          </h1>

          <p className="text-center text-gray-400 mb-6">
            Join Emotion AI and start meaningful conversations
          </p>

          <form onSubmit={handleSignup} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                required
                placeholder="Rahul Kumar"
                value={data.name}
                onChange={(e) =>
                  setData({ ...data, name: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-lg
                bg-white/5 border border-white/10
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, email: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-lg
                bg-white/5 border border-white/10
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-lg
                bg-white/5 border border-white/10
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                outline-none transition"
              />
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Login */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-blue-400 hover:text-blue-300"
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

export default SignUp;