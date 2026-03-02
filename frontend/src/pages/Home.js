import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-base-100 bg-gradient-to-br from-gray-900 to-black text-white px-8 py-20">
      <h1 className="text-5xl font-bold text-primary">Welcome to Chatbot</h1>

      <p className="opacity-70 text-center max-w-md mt-4">
        Login or signup to start chatting with the AI model.
      </p>

      <div className="flex gap-4 mt-8">
        <Link to="/chat" className="mt-10 px-8 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-200">Try Emotion Chatbot</Link>
        <Link to="/dashboard" className="mt-10 px-8 py-2 bg-white text-black rounded-md text-sm font-semibold hover:bg-gray-200">Dashboard</Link>
      </div>
    </div>
  );
};

export default Home;
