import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/admin-auth/signup", data);

      navigate("/verify-otp", {
        state: { email: res.data.email, role: "admin" , isAdmin:true }
      });

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleSignup} className="p-6 shadow bg-white rounded w-80">
        <h2 className="text-xl mb-4">Admin Signup</h2>

        <input placeholder="Name"
          onChange={(e)=>setData({...data,name:e.target.value})} />

        <input placeholder="Email"
          onChange={(e)=>setData({...data,email:e.target.value})} />

        <input type="password" placeholder="Password"
          onChange={(e)=>setData({...data,password:e.target.value})} />

        <button className="mt-4 w-full bg-red-500 text-white p-2">
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default AdminSignup;