import express from "express";
import axios from "axios";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// emotion route from the model
router.post("/emotion", async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      error: "imageBase64 is required",
      message:"Provide Image in base64 format"
    });
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/detect-emotion",
      {
        image: imageBase64,
      }
    );

    res.json(response.data);
    

  } catch (err) {

    console.error("Emotion API error:", err.message);

    res.status(500).json({
      error: "Emotion detection failed",
    });
  }
});

export default router;