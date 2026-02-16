import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/register",
        data,
      );

      // save token
      localStorage.setItem("token", res.data.token);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-base-200 bg-gradient-to-br from-gray-900 to-black text-white px-8 py-20">
      <div className="card bg-base-100 shadow-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">Create Account</h1>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <label className=" block mb-4">
            <span className="text-gray-300">Full Name</span>
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full mt-2 w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white outline-none focus:border-blue-500"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-300 ">Email Address</span>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full mt-2 w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white outline-none focus:border-blue-500"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-300">Password</span>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full mt-2 w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white outline-none focus:border-blue-500"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </label>

          <button
            className="btn btn-primary w-full w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r 
                     from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                     transition shadow-lg active:scale-95"
            type="submit"
          >
            Sign Up
          </button>

          <p className="text-center text-sm">
            Already have an account?
            <Link className="text-primary ml-1" to="/login">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
