import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-8 py-20">

      {/* ---------- HERO SECTION ---------- */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          Emotion Recognition & Adaptive AI Chatbot
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          This project is an advanced Emotion Recognition and Emotion-Adaptive Chatbot
          System designed to understand human feelings and respond with meaningful,
          supportive, and personalized conversations. The system uses a dual-modal
          approach, combining facial expression analysis and audio emotion recognition
          to accurately sense how a user is feeling in real time. By processing both
          visual and vocal cues, it overcomes the limitations of single-mode emotion
          detection and provides a much more reliable interpretation of human
          emotional states.
          <br /><br />
          Once an emotion such as sad, angry, happy, neutral, fear, or disgust is
          detected, the system automatically communicates this emotional state to the
          integrated AI chatbot. The chatbot then adjusts its tone, language style,
          and conversational behavior based on the detected emotion. For example, if
          the user appears sad, the chatbot shifts into a warm, comforting tone
          designed to uplift the user’s mood. If the user is angry, it becomes calmer
          and more patient. If the user is happy, it responds with excitement and
          positivity. This dynamic emotional alignment makes the chatbot feel more
          human-like, empathetic, and responsive.
          <br /><br />
          At the technical level, the project works through a pipeline of real-time
          video processing, audio feature extraction, deep learning–based emotion
          classifiers, and a cloud-ready FastAPI backend. The emotion-aware chatbot is
          powered by a modern conversational AI model, which enables it to have
          natural, flowing conversations that adapt instantly to the emotional cues
          provided by the system. The entire solution is deployable on cloud
          platforms like Railway, making it accessible through web interfaces or
          mobile applications.
          <br /><br />
          The main goal of this system is not just to detect emotions, but to
          positively influence them. It is designed to act as a digital emotional
          companion—capable of identifying distress, providing encouragement,
          reducing stress, uplifting mood, and improving user well-being through
          empathetic interactions. This makes the project highly applicable in
          mental health support, student counseling, customer care, wellness apps,
          and human–AI interaction research.
          <br /><br />
          In essence, this Emotion Recognition and Adaptive Chatbot System
          demonstrates how AI can go beyond automation and truly connect with users
          on an emotional level. By merging computer vision, audio analysis, and
          conversational intelligence, the project showcases a new generation of
          emotionally aware AI systems that make technology more human, helpful, and
          supportive.
        </p>

        <Link
          to="/chat"
          className="mt-10 inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
          text-white rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition"
        >
          Start Chatting
        </Link>
      </div>

    </div>
  );
};

export default About;
