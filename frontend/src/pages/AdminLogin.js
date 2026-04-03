import React, { useState } from "react";
import api from "../api/axios";

const AdminLogin = () => {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/admin-auth/login", data);

      if (res.data.success) {
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-xl border border-white/20 
        p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white">
          Admin Login
        </h2>

        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg bg-white/20 text-white 
            placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="px-4 py-3 rounded-lg bg-white/20 text-white 
            placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold rounded-xl
          bg-gradient-to-r from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          transition-all duration-200
          shadow-lg hover:shadow-xl active:scale-95 text-white"
        >
          Login
        </button>

      </form>
    </div>
  );
};

export default AdminLogin;