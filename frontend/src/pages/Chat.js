import React, { useRef, useState, useEffect, useCallback } from "react";
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


  /* Capture Image */
  const captureImage = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) detectEmotion(screenshot);
  }, []);


  /* Auto Capture */
  useEffect(() => {
    if (!autoCapture) return;

    const interval = setInterval(captureImage, 3000);
    return () => clearInterval(interval);

  }, [autoCapture, captureImage]);


  /* Emotion API */
  const detectEmotion = async (base64Image) => {
    try {

      const res = await axios.post(
        "http://localhost:8080/api/emotion",
        { imageBase64: base64Image },
        {
          withCredentials: true,
        },
      );

      setEmotionData({
        emotion: res.data.emotion || "Neutral",
        confidence: Math.round(res.data.confidence || 0),
      });

    } catch (error) {
      console.log("Emotion API emotion error:", error);
    }
  };


  /* Send Message */
  const sendMessage = async () => {

    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText }
    ]);

    try {

      const res = await axios.post(
        "http://localhost:8080/api/chat",
        {
          message: userText,
          emotion: emotionData.emotion,
        },
        {
          withCredentials: true,
        },
      );

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply || "No response" }
      ]);

    } catch {

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error" }
      ]);

    }

  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (

    <div className="flex w-full h-[calc(100vh-70px)] overflow-hidden bg-[#0c0c0e] text-white">


      {/* Sidebar */}
      <div className="w-[240px] border-r border-gray-800 p-4 flex flex-col flex-shrink-0">

        <h2 className="text-xl font-semibold mb-4">
          Chats
        </h2>

        <button className="w-full bg-white text-black py-2 rounded-md font-medium hover:bg-gray-200">
          + New Chat
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Single session demo mode
        </p>

      </div>



      {/* Main Panel */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">


        {/* Emotion Section (Fixed Height) */}
        <div className="flex gap-8 flex-shrink-0">


          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg border border-gray-700 w-[320px]"
          />


          <div>

            <h1 className="text-xl font-semibold mb-3">
              Emotion Detection
            </h1>


            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">

              <p>
                Emotion:
                <span className="ml-2 px-2 py-1 bg-blue-600 rounded text-sm">
                  {emotionData.emotion}
                </span>
              </p>

              <p className="mt-2">
                Confidence: {emotionData.confidence}%
              </p>

            </div>


            <div className="mt-4 flex gap-3">

              <button
                onClick={captureImage}
                className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
              >
                Capture Once
              </button>


              <button
                onClick={() => setAutoCapture(!autoCapture)}
                className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
              >
                {autoCapture ? "Stop Auto" : "Start Auto"}
              </button>

            </div>

          </div>

        </div>



        {/* Chat Messages (Scrollable Only Here) */}
        <div className="flex-1 overflow-y-auto border border-gray-800 rounded-lg p-4 bg-gray-950">


          {messages.length === 0 ? (
            <p className="text-gray-500">
              No messages yet. Start the conversation.
            </p>
          ) : (
            messages.map((msg, index) => (

              <div
                key={index}
                className={`p-3 my-2 max-w-[70%] rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-600 ml-auto"
                    : "bg-gray-800"
                }`}
              >
                {msg.text}
              </div>

            ))
          )}

        </div>



        {/* Input Bar (Fixed Bottom) */}
        <div className="flex gap-3 flex-shrink-0">


          <textarea
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 resize-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />


          <button
            onClick={sendMessage}
            className="px-6 bg-white text-black rounded-lg font-semibold hover:bg-gray-200"
          >
            Send
          </button>


        </div>


      </div>


    </div>

  );
};

export default Chat;