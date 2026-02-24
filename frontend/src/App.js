import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Chat from "./pages/Chat";
import Chatbot from "./pages/Chatbot";
import Navbar from "./component/Navbar.js";
import Contact from "./pages/Contact.js";

function App() {
  return (
    <BrowserRouter>
  
      <div className="h-screen flex flex-col overflow-hidden">

        {/* Navbar fixed */}
        <Navbar />

        {/* Pages container */}
        <div className="flex-1 overflow-hidden">

          <Routes>

            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;