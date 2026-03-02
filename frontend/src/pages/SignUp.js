import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:8080/api/auth/signup",
        data,
        { withCredentials: true }
      );

      navigate("/home");

    } catch (err) {

      setError(
        err.response?.data?.message || "Signup failed!"
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-gray-900 via-black to-gray-900
    px-4">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg
        border border-gray-700
        rounded-2xl shadow-2xl p-8">

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            Create Account
          </h1>

          <p className="text-center text-gray-400 mb-6">
            Join Emotion AI and start chatting
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500
            text-red-400 p-3 rounded-lg mb-4 text-sm">

              {error}

            </div>
          )}

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >

            {/* Name */}
            <div>

              <label className="text-gray-300 text-sm">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                value={data.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    name: e.target.value,
                  })
                }

                className="w-full mt-2 px-4 py-3
                bg-black/40
                border border-gray-600
                rounded-lg
                text-white
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
                outline-none
                transition"
                required
              />

            </div>


            {/* Email */}
            <div>

              <label className="text-gray-300 text-sm">
                Email Address
              </label>

              <input
                type="email"
                placeholder="example@email.com"
                value={data.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    email: e.target.value,
                  })
                }

                className="w-full mt-2 px-4 py-3
                bg-black/40
                border border-gray-600
                rounded-lg
                text-white
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
                outline-none
                transition"
                required
              />

            </div>


            {/* Password */}
            <div>

              <label className="text-gray-300 text-sm">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={(e) =>
                  setData({
                    ...data,
                    password: e.target.value,
                  })
                }

                className="w-full mt-2 px-4 py-3
                bg-black/40
                border border-gray-600
                rounded-lg
                text-white
                focus:border-blue-500
                focus:ring-1 focus:ring-blue-500
                outline-none
                transition"
                required
              />

            </div>


            {/* Button */}
            <button
              type="submit"

              className="w-full py-3 text-lg font-semibold
              rounded-lg

              bg-gradient-to-r
              from-blue-500 to-purple-600

              hover:from-blue-600
              hover:to-purple-700

              transition
              shadow-lg
              active:scale-95"
            >

              Create Account

            </button>


            {/* Login link */}
            <p className="text-center text-gray-400 text-sm">

              Already have an account?

              <Link
                to="/login"
                className="ml-1 text-blue-400 hover:text-blue-300"
              >
                Sign In
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>

  );
};

export default SignUp;