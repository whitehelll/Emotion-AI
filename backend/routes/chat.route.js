import express from "express";
import axios from "axios";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protectRoute);

const FLASK_BASE_URL = process.env.FLASK_BASE_URL || "http://localhost:5000";

// ------------------------
// CHAT
// ------------------------
router.post("/chat", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_BASE_URL}/chat`, {
      ...req.body,
      userId: req.user._id, // ✅ USER ID ADDED
    });

    res.json(response.data);
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ reply: "Chatbot server error" });
  }
});

// ------------------------
// HISTORY
// ------------------------
router.get("/history", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_BASE_URL}/history`, {
      params: { userId: req.user._id },
    });

    res.json(response.data);
  } catch (error) {
    console.error("History error:", error.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ------------------------
// NEW CHAT
// ------------------------
router.post("/newchat", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_BASE_URL}/newchat`, {
      userId: req.user._id,
    });

    res.json(response.data);
  } catch (error) {
    console.error("New chat error:", error.message);
    res.status(500).json({ error: "Failed to start new chat" });
  }
});

// ------------------------
// CHAT DESCRIPTIONS
// ------------------------
router.get("/chat_descriptions", async (req, res) => {
  try {
    const response = await axios.get(`${FLASK_BASE_URL}/chat_descriptions`, {
      params: { userId: req.user._id },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Descriptions error:", error.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// ------------------------
// GET CHAT
// ------------------------
router.get("/chat/:chat_id", async (req, res) => {
  try {
    const response = await axios.get(
      `${FLASK_BASE_URL}/chat/${req.params.chat_id}`,
      {
        params: { userId: req.user._id },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Get chat error:", error.message);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

export default router;