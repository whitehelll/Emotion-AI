import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { loginMutation, isPending, error } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(data);
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
rounded-2xl shadow-2xl p-8"
        >
          {/* Title */}

          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            Welcome Back
          </h1>

          <p className="text-center text-gray-400 mb-6">Login to Emotion AI</p>

          {/* Error */}

          {error && (
            <div
              className="bg-red-500/20 border border-red-500
text-red-400 p-3 rounded-lg mb-4 text-sm"
            >
              Login failed. Please try again.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}

            <div>
              <label className="text-gray-300 text-sm">Email Address</label>

              <input
                type="email"
                value={data.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    email: e.target.value,
                  })
                }
                placeholder="example@email.com"
                className="w-full mt-2 px-4 py-3
bg-black/40
border border-gray-600
rounded-lg
text-white
focus:border-blue-500
focus:ring-1 focus:ring-blue-500
outline-none"
              />
            </div>

            {/* Password */}

            <div>
              <label className="text-gray-300 text-sm">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) =>
                    setData({
                      ...data,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full mt-2 px-4 py-3
bg-black/40
border border-gray-600
rounded-lg
text-white
focus:border-blue-500
focus:ring-1 focus:ring-blue-500
outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2
-transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot password */}

              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}

            <button
              disabled={isPending}
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
              {isPending ? "Logging in..." : "Login"}
            </button>

            {/* Signup */}

            <p className="text-center text-gray-400 text-sm">
              Don't have an account?
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
