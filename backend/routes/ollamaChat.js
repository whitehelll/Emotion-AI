const express = require("express");
const axios = require("axios");

const router = express.Router();

// POST /api/ollama-chat → forwards to Flask LLaMA API
router.post("/ollama-chat", async (req, res) => {
  const { message, emotion } = req.body;

  try {
    const response = await axios.post("http://127.0.0.1:5000/chat", {
      message,
      emotion
    });

    res.json({ reply: response.data.reply });

  } catch (err) {
    console.error("Error talking to Flask Ollama API:", err.message);
    return res.status(500).json({ reply: "LLaMA chatbot failed." });
  }
});

module.exports = router;
