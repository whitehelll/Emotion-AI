const express = require("express");
const axios = require("axios");

const router = express.Router();

// Store chat history (in memory for now)
let chatHistory = [];

// POST /api/chat
router.post("/chat", async (req, res) => {
  const { message, emotion } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required" });
  }

  // 1. Save user message to history
  chatHistory.push({ role: "user", content: message });

  try {
    // 2. Prepare Ollama messages
    const messages = [
      {
        role: "system",
        content: `You are an empathetic AI assistant. 
User's current emotion is: ${emotion}.
Respond in a helpful, emotional-aware tone.`,
      },
      ...chatHistory,
    ];

    // 3. Call Ollama (local)
    const response = await axios.post(
      "http://127.0.0.1:5001/",
      {
        model: "llama3",      // or llama3:8b, phi3, etc.
        messages: messages,
        stream: false
      }
    );

    const botReply = response.data.message.content;

    // 4. Save bot reply in history
    chatHistory.push({ role: "assistant", content: botReply });

    return res.json({ reply: botReply });

  } catch (error) {
    console.error("Ollama Chat Error:", error.message);
    return res.status(500).json({ reply: "Chatbot error occurred." });
  }
});

module.exports = router;
