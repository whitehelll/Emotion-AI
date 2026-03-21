import express from "express";
import axios from "axios";

const router = express.Router();

// POST /api/ollama-chat → forwards to Flask LLaMA API
router.post("/ollama-chat", async (req, res) => {

  const { message, emotion } = req.body;

  try {

    const response = await axios.post(
      "http://127.0.0.1:5004/chat",
      {
        message,
        emotion
      }
    );

    res.json({
      reply: response.data.reply
    });

  } catch (err) {

    console.error(
      "Error talking to Flask Ollama API:",
      err.message
    );

    res.status(500).json({
      reply: "LLaMA chatbot failed."
    });

  }

});

export default router;