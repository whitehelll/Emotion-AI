import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { Eye, EyeOff, Shield } from "lucide-react";

const Login = () => {
const [data, setData] = useState({
email: "",
password: "",
});

const [showPassword, setShowPassword] = useState(false);
const [isAdmin, setIsAdmin] = useState(false);

const navigate = useNavigate(); // ✅ FIX
const { loginMutation, isPending, error } = useLogin();

const handleLogin = (e) => {
e.preventDefault();


loginMutation(
  {
    ...data,
    type: isAdmin ? "admin" : "user",
  },
  {
    onSuccess: (res) => {
      // ✅ Redirect after login
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/chat");
      }
    },

    onError: (err) => {
      // ✅ Redirect to OTP if not verified
      if (err.response?.data?.isVerified === false) {
        navigate("/verify-otp", {
          state: {
            email: data.email,
            isAdmin,
          },
        });
      }
    },
  }
);


};

return ( <div className="min-h-screen flex items-center justify-center
 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">

```
  <div className="w-full max-w-md">
    <div className="bg-white/5 backdrop-blur-lg
    border border-gray-700
    rounded-2xl shadow-2xl p-8">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-2 text-white">
        {isAdmin ? "Admin Login" : "Welcome Back"}
      </h1>

      <p className="text-center text-gray-400 mb-6">
        {isAdmin ? "Login as administrator" : "Login to Emotion AI"}
      </p>

      {/* Toggle Admin/User */}
      <div className="flex justify-center mb-5">
        <button
          type="button"
          onClick={() => setIsAdmin(!isAdmin)}
          className="flex items-center gap-2 text-sm
          text-blue-400 hover:text-blue-300 transition"
        >
          <Shield size={16} />
          {isAdmin ? "Switch to User Login" : "Login as Admin"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500
        text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error.response?.data?.message || "Login failed"}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-gray-300 text-sm">Email Address</label>

          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="example@email.com"
            className="w-full mt-2 px-4 py-3
            bg-black/40 border border-gray-600
            rounded-lg text-white
            focus:border-blue-500
            focus:ring-1 focus:ring-blue-500
            outline-none transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-300 text-sm">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full mt-2 px-4 py-3
              bg-black/40 border border-gray-600
              rounded-lg text-white
              focus:border-blue-500
              focus:ring-1 focus:ring-blue-500
              outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2
              transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Button */}
        <button
          disabled={isPending}
          className="w-full py-3 text-lg font-semibold
          rounded-lg
          bg-gradient-to-r from-blue-500 to-purple-600
          hover:from-blue-600 hover:to-purple-700
          transition shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        {/* Signup */}
        {!isAdmin && (
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?
            <Link
              to="/signup"
              className="ml-1 text-blue-400 hover:text-blue-300"
            >
              Sign Up
            </Link>
          </p>
        )}

      </form>
    </div>
  </div>
</div>


);
};

export default Login;
