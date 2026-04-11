import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import { protectRoute } from "../middleware/auth.middleware.js";
import Emotion from "../models/Emotion.js";
import { protectAdmin } from "../middleware/adminAuth.middleware.js";

const router = express.Router();

/*
--------------------------------
Detect Emotion + Save to DB
--------------------------------
*/

router.post("/emotion", protectRoute, async (req, res) => {

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      error: "imageBase64 is required",
      message: "Provide image in base64 format"
    });
  }

  try {

    // Call Flask AI model
    const response = await axios.post(
      `${FLASK_EMOTION_URL}/detect-emotion`,
      { image: imageBase64 }
    );

    const { emotion, confidence } = response.data;

    // Save emotion log
    const log = await Emotion.create({
      user: req.user._id,
      emotion,
      confidence
    });

    res.json({
      success: true,
      emotion,
      confidence,
      log
    });

  } catch (err) {

    console.error("Emotion API error:", err.message);

    res.status(500).json({
      success: false,
      error: "Emotion detection failed"
    });

  }

});


/*
--------------------------------
Emotion History
--------------------------------
*/

router.get("/emotion/history", protectAdmin, async (req, res) => {

  try {

    const logs = await Emotion.find({
      user: req.user._id
    })
    .populate("user","name email")
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      logs
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch emotion history"
    });

  }

});


/*
--------------------------------
Emotion Analytics
--------------------------------
*/

router.get("/emotion/analytics", protectAdmin, async (req, res) => {

  try {

    const stats = await Emotion.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $group: {
          _id: "$emotion",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      stats
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Analytics fetch failed"
    });

  }

});


router.get("/emotion/timeline", protectAdmin, async (req, res) => {

  try {

    const data = await Emotion.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%H:%M",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const timeline = data.map(item => ({
      time: item._id,
      detections: item.count
    }));

    res.json({ timeline });

  } catch (error) {

    res.status(500).json({
      error: "Timeline analytics failed"
    });

  }

});

export default router;