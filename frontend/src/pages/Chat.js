import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

axios.defaults.withCredentials = true;

const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8080/api" : "/api";

// ── Emotion styles ────────────────────────────────────────────────────────
const EMOTION_STYLES = {
  happy:     { bg: "bg-yellow-500", ring: "ring-yellow-400", emoji: "😊" },
  sad:       { bg: "bg-blue-500",   ring: "ring-blue-400",   emoji: "💙" },
  angry:     { bg: "bg-red-500",    ring: "ring-red-400",    emoji: "🔥" },
  surprised: { bg: "bg-purple-500", ring: "ring-purple-400", emoji: "😲" },
  fearful:   { bg: "bg-orange-500", ring: "ring-orange-400", emoji: "💛" },
  disgusted: { bg: "bg-green-700",  ring: "ring-green-500",  emoji: "😟" },
  neutral:   { bg: "bg-gray-500",   ring: "ring-gray-400",   emoji: "😌" },
};

function getEmotionStyle(emotion) {
  return EMOTION_STYLES[emotion?.toLowerCase()] || EMOTION_STYLES.neutral;
}

// ── Typing indicator ──────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs shrink-0">
        🤖
      </div>
      <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";
  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
          isUser ? "bg-indigo-500" : "bg-indigo-700"
        }`}
      >
        {isUser ? "👤" : "🤖"}
      </div>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-sm"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Chat() {
  const webcamRef    = useRef(null);
  const messagesEnd  = useRef(null);

  const [messages,      setMessages]      = useState([]);
  const [input,         setInput]         = useState("");
  const [isTyping,      setIsTyping]      = useState(false);
  const [autoCapture,   setAutoCapture]   = useState(false);
  const [webcamReady,   setWebcamReady]   = useState(false);
  const [chatList,      setChatList]      = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Emotion state — only tracked in frontend to detect changes
  const [emotionData,   setEmotionData]   = useState({ emotion: "Neutral", confidence: 0 });
  const lastEmotionRef  = useRef(null); // use ref so captureImage closure is always fresh

  // Auto-scroll
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── STAGE 1: Greeting on mount ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setIsTyping(true);
        console.log("🟡 Calling greeting...");
        const res = await axios.get(`${BASE_URL}/greeting`);
        console.log("🟢 Greeting response:", res.data); 
        
        if (res.data.reply) {
          setMessages([{ sender: "bot", text: res.data.reply }]);
        }
      } catch (err) {
        console.error("🔴 Greeting error:", err.response?.status, err.message);
        setMessages([{
          sender: "bot",
          text: "👋 Hi! I'm your emotional support companion. Capture your emotion to get started 💙",
        }]);
      } finally {
        setIsTyping(false);
      }
    })();
    loadChatList();
  }, []);

  // ── Chat list ───────────────────────────────────────────────────────
  const loadChatList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat_descriptions`);
      setChatList(res.data.chats || []);
    } catch (err) {
      console.error("Chat list error:", err);
    }
  };

  const loadChat = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${id}`);
      const formatted = res.data.chat.messages.map((m) => ({
        sender: m.role === "user" ? "user" : "bot",
        text: m.content,
      }));
      setMessages(formatted);
      setCurrentChatId(id);
    } catch (err) {
      console.error("Load chat error:", err);
    }
  };

  const startNewChat = async () => {
    try {
      await axios.post(`${BASE_URL}/newchat`);

      // Reset local state
      setMessages([]);
      setCurrentChatId(null);
      setEmotionData({ emotion: "Neutral", confidence: 0 });
      lastEmotionRef.current = null;

      // Re-fetch greeting
      setIsTyping(true);
      const res = await axios.get(`${BASE_URL}/greeting`);
      if (res.data.reply) {
        setMessages([{ sender: "bot", text: res.data.reply }]);
      }
      loadChatList();
    } catch (err) {
      console.error("New chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const loadCurrentHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/history`);
      const formatted = res.data.history.map((m) => ({
        sender: m.role === "user" ? "user" : "bot",
        text: m.content,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  // ── STAGE 2: Emotion detection ──────────────────────────────────────
  const detectEmotion = useCallback(async (base64Image) => {
    try {
      // 1. Call your emotion model
      const res = await axios.post(`${BASE_URL}/emotion`, {
        imageBase64: base64Image,
      });

      const detectedEmotion = res.data.emotion || "Neutral";
      const confidence      = Math.round(res.data.confidence || 0);

      setEmotionData({ emotion: detectedEmotion, confidence });

      // 2. Only notify backend if emotion actually changed
      if (lastEmotionRef.current?.toLowerCase() === detectedEmotion.toLowerCase()) return;
      lastEmotionRef.current = detectedEmotion;

      setIsTyping(true);
      const chatRes = await axios.post(`${BASE_URL}/emotion_detected`, {
        emotion: detectedEmotion,
      });

      if (chatRes.data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: chatRes.data.reply }]);
      }
    } catch (err) {
      console.error("Emotion detection error:", err);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) detectEmotion(screenshot);
  }, [detectEmotion]);

  useEffect(() => {
    if (!autoCapture) return;
    const interval = setInterval(captureImage, 3000);
    return () => clearInterval(interval);
  }, [autoCapture, captureImage]);

  // ── STAGE 3: Send message ───────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsTyping(true);

    try {
      const res = await axios.post(`${BASE_URL}/chat`, { message: text });

      if (res.data.reply) {
        setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
      }
      loadChatList();
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const emotionStyle = getEmotionStyle(emotionData.emotion);

  return (
    <div className="flex w-full h-[calc(100vh-70px)] overflow-hidden bg-[#0c0c0e] text-white">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="w-[220px] shrink-0 border-r border-gray-800 flex flex-col bg-[#111114]">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Chats
          </h2>
          <button
            onClick={startNewChat}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            + New Chat
          </button>
          <button
            onClick={loadCurrentHistory}
            className="w-full mt-2 border border-gray-700 hover:border-gray-500 py-2 px-3 rounded-lg text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            Load Current
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chatList.length === 0 && (
            <p className="text-xs text-gray-600 text-center mt-6 px-2">No saved chats yet</p>
          )}
          {chatList.map((chat) => (
            <button
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              className={`w-full text-left p-2 text-xs rounded-lg mb-1 truncate transition-colors ${
                currentChatId === chat.id
                  ? "bg-indigo-900/40 text-indigo-300"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {chat.description}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top panel: webcam + emotion display */}
        <div className="flex gap-4 p-4 border-b border-gray-800 bg-[#111114] shrink-0">
          <div className={`rounded-xl overflow-hidden ring-2 transition-all duration-500 ${emotionStyle.ring}`}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              onUserMedia={() => setWebcamReady(true)}
              className="w-[200px] h-[150px] object-cover block"
            />
          </div>

          <div className="flex flex-col justify-between flex-1">
            <div>
              <h1 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Emotion Detected
              </h1>
              <div className="flex items-center gap-3">
                <span className={`${emotionStyle.bg} px-4 py-1.5 rounded-full text-sm font-semibold text-white`}>
                  {emotionStyle.emoji} {emotionData.emotion}
                </span>
                {emotionData.confidence > 0 && (
                  <span className="text-gray-500 text-sm">{emotionData.confidence}%</span>
                )}
              </div>
              {!webcamReady && (
                <p className="text-xs text-orange-400 mt-2">⚠️ Waiting for camera access…</p>
              )}
            </div>

            <div className="flex gap-2 mt-3 flex-wrap items-center">
              <button
                onClick={captureImage}
                disabled={!webcamReady}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 disabled:opacity-40 border border-gray-700 rounded-lg transition-colors"
              >
                📷 Capture Once
              </button>
              <button
                onClick={() => setAutoCapture((v) => !v)}
                disabled={!webcamReady}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  autoCapture
                    ? "bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900/70"
                    : "bg-gray-800 hover:bg-gray-700 border-gray-700"
                } disabled:opacity-40`}
              >
                {autoCapture ? "⏹ Stop Auto" : "▶ Auto Detect"}
              </button>
              {autoCapture && (
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Detecting every 3s
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEnd} />
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-gray-800 bg-[#111114] shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              className="flex-1 bg-gray-900 border border-gray-700 focus:border-indigo-500 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm resize-none outline-none transition-colors leading-relaxed"
              style={{ maxHeight: "120px", overflowY: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors shrink-0"
            >
              Send ↑
            </button>
          </div>
          <p className="text-[10px] text-gray-700 mt-1.5 text-center">
            Shift+Enter for newline · Capture emotion to personalise responses
          </p>
        </div>
      </main>
    </div>
  );
}