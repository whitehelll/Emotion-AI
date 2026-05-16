import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">

      {/* 🔥 Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
          alt="bg"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617]/90 to-black"></div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5">
        <h1 className="text-xl font-bold text-[#7cc0ff]">Emotion AI</h1>

        <div className="flex gap-6 items-center text-sm">
          <a href="#features" className="text-gray-300 hover:text-white">
            Features
          </a>
          <Link to="/login" className="hover:text-white">
            User Login
          </Link>
          <Link to="/admin-login" className="text-red-400 hover:text-red-300">
            Admin
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <div className="relative z-10 text-center mt-20 px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
          <span className="text-[#7cc0ff]">AI that understands</span>
          <br />
          emotions, not just text.
        </h1>

        <p className="text-gray-400 mt-6 max-w-xl mx-auto">
          Experience conversations that feel human. Built with intelligence,
          empathy, and real-time emotional understanding.
        </p>
      </div>

      {/* ================= PORTAL SELECTION ================= */}
      <div className="relative z-10 mt-16 px-6 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* USER CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl hover:scale-105 transition">

          <h2 className="text-2xl font-semibold text-[#7cc0ff] mb-4">
            👤 User Portal
          </h2>

          <p className="text-gray-400 mb-6">
            Chat with Emotion AI, track your interactions, and explore
            intelligent conversations.
          </p>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-500 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-6 py-2 border border-white/20 rounded-md hover:bg-white/10 transition"
            >
              Signup
            </Link>
          </div>
        </div>

        {/* ADMIN CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-red-400/20 p-8 rounded-3xl shadow-xl hover:scale-105 transition">

          <h2 className="text-2xl font-semibold text-red-400 mb-4">
            🛡️ Admin Portal
          </h2>

          <p className="text-gray-400 mb-6">
            Manage users, analyze emotion data, and monitor system performance.
          </p>

          <div className="flex gap-4">
            <Link
              to="/admin-login"
              className="px-6 py-2 bg-red-500 rounded-md font-semibold hover:bg-red-600 transition"
            >
              Login
            </Link>

            <Link
              to="/admin-signup"
              className="px-6 py-2 border border-red-400/30 rounded-md hover:bg-red-500/20 transition"
            >
              Signup
            </Link>
          </div>
        </div>

      </div>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="relative z-10 mt-24 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
      >
        {[
          {
            title: "Emotion Detection",
            desc: "AI understands tone, mood, and intent in real-time.",
          },
          {
            title: "Human-like Chat",
            desc: "Conversations that feel natural and engaging.",
          },
          {
            title: "Admin Analytics",
            desc: "Track usage, behavior, and emotional insights.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg"
          >
            <h3 className="text-lg font-semibold text-[#7cc0ff] mb-2">
              {f.title}
            </h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ================= CTA ================= */}
      <div className="relative z-10 text-center mt-20 mb-16">
        <Link
          to="/signup"
          className="px-10 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-lg font-semibold hover:scale-105 transition"
        >
          Start as User
        </Link>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 text-center text-gray-500 text-sm pb-6">
        © 2026 Emotion AI — Built with Intelligence & Empathy
      </footer>
    </div>
  );
};

export default Landing;