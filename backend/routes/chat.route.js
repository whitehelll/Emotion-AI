import express from "express";
import axios from "axios";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.post("/chat", async (req, res) => {

  const { message, emotion } = req.body;

  if (!message) {
    return res.status(400).json({
      reply: "Message required",
    });
  }

  try {

    const response = await axios.post(
      "http://127.0.0.1:5000/chat",
      {
        message: `${message}. User emotion is ${emotion}`
      }
    );

    res.json({
      reply: response.data.reply
    });

  } catch (error) {

    console.log("Flask Error:");
    console.log(error.message);

    res.status(500).json({
      reply: "Chatbot server error"
    });

  }

});

export default router;