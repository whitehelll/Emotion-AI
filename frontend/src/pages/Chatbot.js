
import React, { useEffect, useRef, useState } from "react";

const BACKEND_URL = "http://localhost:8080";

function Chatbot() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10));
  const [isCapturing, setIsCapturing] = useState(false);

  // Get webcam access
  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
    initCamera();
  }, []);

  // Capture frame as base64iuytrewer
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg"); // "data:image/jpeg;base64,...."
    const base64 = dataUrl.split(",")[1]; // remove prefix
    return base64;
  };

  const detectEmotion = async () => {
    const base64 = captureFrame();
    if (!base64) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/emotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      const data = await res.json();
      if (data.error) {
        console.error("Emotion error:", data.error);
        return;
      }
      setEmotion(data.emotion);
      setConfidence(data.confidence?.toFixed(1));
    } catch (err) {
      console.error("Error calling emotion API:", err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          emotion,
          sessionId,
        }),
      });

      const data = await res.json();
      if (data.error) {
        console.error("Chat error:", data.error);
        return;
      }

      setHistory(data.history || []);
      setMessage("");
    } catch (err) {
      console.error("Error calling chat API:", err);
    }
  };

  const handleNewChat = () => {
    setHistory([]);
    setEmotion(null);
    setConfidence(null);
    setMessage("");
  };

  // Optional: auto capture emotion every few seconds when enabled
  useEffect(() => {
    if (!isCapturing) return;
    const id = setInterval(() => {
      detectEmotion();
    }, 3000);
    return () => clearInterval(id);
  }, [isCapturing]);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", borderRight: "1px solid #ddd", padding: "16px", boxSizing: "border-box" }}>
        <h2>Chats</h2>
        <button onClick={handleNewChat} style={{ padding: "8px 12px", marginBottom: "16px", cursor: "pointer" }}>
          + New Chat
        </button>
        <div>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            (Demo) Only one chat session stored in memory.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top: video + emotion */}
        <div style={{ display: "flex", padding: "16px", borderBottom: "1px solid #ddd" }}>
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "320px", height: "240px", backgroundColor: "#000", borderRadius: "8px" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
          <div style={{ marginLeft: "24px" }}>
            <h2>Emotion Detection</h2>
            <p>
              <strong>Emotion:</strong> {emotion || "Unknown"}
            </p>
            <p>
              <strong>Confidence:</strong> {confidence ? `${confidence}%` : "-"}
            </p>
            <button
              onClick={detectEmotion}
              style={{ padding: "8px 12px", marginRight: "8px", cursor: "pointer" }}
            >
              Capture Emotion Once
            </button>
            <button
              onClick={() => setIsCapturing((prev) => !prev)}
              style={{ padding: "8px 12px", cursor: "pointer" }}
            >
              {isCapturing ? "Stop Auto Capture" : "Start Auto Capture"}
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {history.length === 0 && (
              <p style={{ color: "#888" }}>No messages yet. Say hi to the chatbot!</p>
            )}

            {history.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "8px",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    backgroundColor: msg.role === "user" ? "#d1e7ff" : "#fff",
                    maxWidth: "70%",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", fontWeight: "bold", marginBottom: "4px" }}>
                    {msg.role === "user" ? "You" : "Bot"}
                    {msg.emotion && msg.role === "user" && (
                      <span style={{ marginLeft: "6px", fontWeight: "normal", color: "#555" }}>
                        ({msg.emotion})
                      </span>
                    )}
                  </div>
                  <div>{msg.message}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "8px 16px",
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
              style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <button onClick={sendMessage} style={{ padding: "8px 16px", cursor: "pointer" }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

