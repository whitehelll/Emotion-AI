const express = require("express");
const axios = require("axios");

const router = express.Router();

// POST /api/emotion
router.post("/emotion", async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "imageBase64 is required" });
  }

  try {
    // Forward image to Python Flask backend
    const response = await axios.post("http://127.0.0.1:5001/detect-emotion", {
      image: imageBase64,
    });

    return res.json(response.data);

  } catch (err) {
    console.error("Error calling Python face emotion API:", err.message);

    if (err.response) {
      console.error("Python face API responded:", err.response.data);
    }

    return res.status(500).json({ error: "Emotion detection failed" });
  }
});

module.exports = router;
