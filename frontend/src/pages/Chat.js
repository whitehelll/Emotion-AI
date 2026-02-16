import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const Chat = () => {
  const webcamRef = useRef(null);
  const [emotionData, setEmotionData] = useState({
    emotion: "Neutral",
    confidence: 0,
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [autoCapture, setAutoCapture] = useState(false);

  // Capture Image from Webcam
  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) detectEmotion(screenshot);
  };

  // Auto capture emotion every 3 seconds
  useEffect(() => {
    let interval;
    if (autoCapture) {
      interval = setInterval(() => {
        captureImage();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoCapture]);

  // Send image to Node → Flask Emotion API
  const detectEmotion = async (base64Image) => {
    try {
      const res = await axios.post("http://localhost:8080/api/emotion", {
        imageBase64: base64Image,
      });
      setEmotionData({
        emotion: res.data.emotion,
        confidence: res.data.confidence,
      });
    } catch (error) {
      console.log("Emotion API error:", error);
    }
  };

  // Send message to Node Chatbot API
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:8080/api/ollama-chat", {

        message: input,
        emotion: emotionData.emotion,
      });

      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);

      setInput("");
    } catch (error) {
      console.log("Chat API error:", error);
    }
  };

  // ✔ Send message on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      sendMessage();
    }
  };

  return (
    <div className="flex w-full h-screen">

      {/* ------------ LEFT CHAT LIST ------------ */}
      <div className="w-[250px] bg-black-100 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <button className="btn btn-primary w-full mb-4">+ New Chat</button>
        <p className="text-sm text-gray-600">(Demo) Only one chat session stored</p>
      </div>

      {/* ------------ MAIN CENTER PANEL ------------ */}
      <div className="flex-1 flex flex-col p-4">

        {/* ------------ EMOTION DETECTION ------------ */}
        <div className="flex items-start gap-8">
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg border w-[350px]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Emotion Detection</h1>
            <p className="text-lg mt-3">
              <strong>Emotion:</strong> {emotionData.emotion}
            </p>
            <p className="text-lg">
              <strong>Confidence:</strong> {emotionData.confidence}%
            </p>

            <div className="mt-4 flex gap-4">
              <button onClick={captureImage} className="btn btn-outline">
                Capture Emotion Once
              </button>

              <button
                onClick={() => setAutoCapture(!autoCapture)}
                className="btn btn-outline"
              >
                {autoCapture ? "Stop Auto Capture" : "Start Auto Capture"}
              </button>
            </div>
          </div>
        </div>

        {/* ------------ CHAT AREA ------------ */}
        <div className="bg-black-50 border rounded-lg flex-1 mt-6 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet. Say hi to the chatbot!</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-2 w-fit rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"      // user message
                    : "bg-green-300 text-black"             // bot message color
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* ------------ INPUT BAR ------------ */}
        <div className="mt-4 flex">
          <textarea
            className="textarea textarea-bordered flex-1 h-16"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}   // ✔ Enter-to-send
          />

          <button className="btn btn-primary ml-2 h-16" onClick={sendMessage}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;
