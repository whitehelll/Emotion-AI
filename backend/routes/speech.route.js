// routes/speech.route.js

import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const router = express.Router();

// Multer config (temporary storage)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// POST /api/speech/predict
router.post("/predict", upload.single("audio"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const filePath = path.resolve(req.file.path);

  try {
    // Forward file to Flask ML service
    const formData = new FormData();
    formData.append("audio", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://127.0.0.1:5002/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    // Delete temp file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      speech_emotion: response.data.speech_emotion
    });

  } catch (error) {

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Speech Emotion Error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Speech Emotion prediction failed"
    });
  }
});

export default router;