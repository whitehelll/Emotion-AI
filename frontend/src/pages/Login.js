import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loginMutation, isPending, error } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();

    loginMutation(
      {
        ...data,
        type: "user", // ✅ fixed
      },
      {
        onSuccess: () => {
          navigate("/chat");
        },
        onError: (err) => {
          if (err.response?.data?.isVerified === false) {
            navigate("/verify-otp", {
              state: { email: data.email, isAdmin: false },
            });
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 text-white font-sans">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="calm"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-black"></div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-gray-400 mb-6">
            Login to your Emotion AI account
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error.response?.data?.message || "Login failed"}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full mt-2 px-4 py-3 rounded-lg
                bg-white/5 border border-white/10
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
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
                  className="w-full mt-2 px-4 py-3 rounded-lg
                  bg-white/5 border border-white/10
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
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
              className="w-full py-3 text-lg font-semibold rounded-lg
              bg-gradient-to-r from-blue-500 to-purple-600
              hover:from-blue-600 hover:to-purple-700
              transition-all duration-300 shadow-lg
              hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>

            {/* Signup */}
            <p className="text-center text-gray-400 text-sm">
              Don’t have an account?
              <Link
                to="/signup"
                className="ml-1 text-blue-400 hover:text-blue-300"
              >
                Sign Up
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;