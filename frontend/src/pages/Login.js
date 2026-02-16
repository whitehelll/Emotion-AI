import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", data);

      // save JWT token
      localStorage.setItem("token", res.data.token);

      navigate("/chat"); // redirect to chat or home
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-base-200 bg-gradient-to-br from-gray-900 to-black text-white px-8 py-20">
      <div className="card bg-base-100 shadow-xl p-6 w-full max-w-md text-2xl font-semibold mb-4 ">
        <h1 className="text-3xl font-bold text-center mb-4">Sign In</h1>

        {error && <div className="alert alert-error mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4 ">
          <label className="block mb-4">
            <span className="text-gray-300">Email Address</span>
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
            Sign In
          </button>

          <p className="text-center text-sm">
            Don’t have an account?
            <Link className="text-primary ml-1" to="/signup">
              Create One
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
