import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white overflow-hidden font-sans">


      {/* ---------------- MAIN HERO SECTION ---------------- */}
      <div className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
          <span className="text-[#7cc0ff]">A chatbot</span> that understands feelings<br />
          not just words.
          
        </h1>

        <p className="text-gray-400 mt-6 text-lg max-w-xl">
          Deliver accurate, consistent designs faster
        </p>

        <Link to="/chat" className="mt-10 px-8 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-200">Try Emotion Chatbot</Link>

        
      </div>

      {/* ---------------- FLOATING SIDE BUTTONS ---------------- */}

    </div>
  );
};

export default Landing;
