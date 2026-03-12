import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp,setOtp] = useState("");
  const [error,setError]=useState("");

  const verifyOTP = async (e)=>{

    e.preventDefault();

    try{

      await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        {
          email,
          otp
        }
      );

      alert("Email Verified");

      navigate("/login");

    }catch(err){

      setError(
        err.response?.data?.message ||
        "Invalid OTP"
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-gray-900 via-black to-gray-900">

      <div className="bg-white/5 p-8 rounded-2xl
      border border-gray-700 w-[350px] text-white">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Verify Email
        </h2>

        <p className="text-gray-400 text-center mb-5">
          Enter OTP sent to email
        </p>

        {error && (
          <div className="text-red-400 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={verifyOTP}>

          <input
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            placeholder="Enter OTP"

            className="w-full p-3 rounded-lg
            bg-black/40 border border-gray-600
            mb-4 outline-none"
          />

          <button
            className="w-full p-3 rounded-lg
            bg-blue-500 hover:bg-blue-600"
          >
            Verify OTP
          </button>

        </form>

      </div>

    </div>

  );
};

export default VerifyOTP;