import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Hook this to your backend API if needed
    console.log("Form Submitted:", form);

    alert("Thank you! Your message has been received.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white ">
      
      {/* ---------- HEADER ---------- */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-extrabold">Contact Us</h1>
        <p className="text-gray-400 mt-3 text-lg">
          Have questions, feedback, or need help? We're here for you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ---------- LEFT SECTION: INFO ---------- */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            We'd love to hear from you! Whether it's about the Emotion Recognition
            System, the AI chatbot, suggestions, or collaboration opportunities—
            feel free to reach out.
          </p>

          <div className="space-y-4 text-gray-300">
            {/* Email */}
            <div className="flex items-center gap-4">
              <span className="text-blue-400 text-xl">📧</span>
              <p>support@emotion-ai.com</p>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <span className="text-green-400 text-xl">📞</span>
              <p>+91 98765 43210</p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <span className="text-purple-400 text-xl">📍</span>
              <p>New Delhi, India</p>
            </div>
          </div>

          <hr className="my-6 border-gray-700" />

          <p className="text-gray-400 text-sm">
            Our emotion-adaptive chatbot project aims to make technology more human,
            empathetic, and helpful. Your feedback helps us improve. 💙
          </p>
        </div>

        {/* ---------- RIGHT SECTION: FORM ---------- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl"
        >
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

          {/* Name */}
          <label className="block mb-4">
            <span className="text-gray-300">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </label>

          {/* Email */}
          <label className="block mb-4">
            <span className="text-gray-300">Email Address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
          </label>

          {/* Message */}
          <label className="block mb-6">
            <span className="text-gray-300">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="mt-2 w-full px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white outline-none focus:border-blue-500 resize-none"
              placeholder="Write your message..."
            ></textarea>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r 
                     from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                     transition shadow-lg active:scale-95"
          >
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;
