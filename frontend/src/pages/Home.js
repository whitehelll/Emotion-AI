import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-base-100 bg-gradient-to-br from-gray-900 to-black text-white px-8 py-20">
      <h1 className="text-5xl font-bold text-primary">Welcome to Chatbot</h1>

      <p className="opacity-70 text-center max-w-md mt-4">
        Login or signup to start chatting with the AI model.
      </p>

      <div className="flex gap-4 mt-8">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
      </div>
    </div>
  );
};

export default Home;
