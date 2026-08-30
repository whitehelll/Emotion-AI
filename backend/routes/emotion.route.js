import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import { protectRoute } from "../middleware/auth.middleware.js";
import Emotion from "../models/Emotion.js";
import { protectAdmin } from "../middleware/adminAuth.middleware.js";

const FLASK_EMOTION_URL =
  process.env.FLASK_EMOTION_URL || "http://127.0.0.1:5000";


const FLASK_CHAT_URL = "http://localhost:5000";

  
const router = express.Router();


/*
--------------------------------
Detect Emotion + Save to DB
--------------------------------
*/router.post("/emotion", protectRoute, async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      error: "imageBase64 is required",
      message: "Provide image in base64 format",
    });
  }

  try {
    const response = await axios.post(
      `${FLASK_EMOTION_URL}/detect-emotion`,
      { image: imageBase64 }
    );

    const { emotion, confidence } = response.data;

    // 🚫 Ignore invalid detections
    if (!emotion || emotion === "No Face Detected") {
      return res.json({
        success: false,
        message: "No valid emotion detected",
      });
    }

    // ✅ ALWAYS use authenticated user
    const log = await Emotion.create({
      user: req.user._id,
      emotion,
      confidence,
    });

    res.json({
      success: true,
      emotion,
      confidence,
      log,
    });

  } catch (err) {
    console.error("Emotion API error:", err.message);

    res.status(500).json({
      success: false,
      error: "Emotion detection failed",
    });
  }
});
/*
--------------------------------
Emotion History (ADMIN)
--------------------------------
*/
router.get("/emotion/history", protectAdmin, async (req, res) => {
  try {
    const logs = await Emotion.find({
      emotion: { $nin: ["No Face Detected", null, ""] }, // ✅ FILTER
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      logs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch emotion history",
    });
  }
});

/*
--------------------------------
Emotion Analytics (ADMIN)
--------------------------------
*/
router.get("/emotion/analytics", protectAdmin, async (req, res) => {
  try {
    const stats = await Emotion.aggregate([
      {
        $match: {
          emotion: { $nin: ["No Face Detected", null, ""] }, // ✅ FILTER
        },
      },
      {
        $group: {
          _id: "$emotion",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      success: true,
      stats,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Analytics fetch failed",
    });
  }
});

/*
--------------------------------
Emotion Timeline (ADMIN)
--------------------------------
*/
router.get("/emotion/timeline", protectAdmin, async (req, res) => {
  try {
    const data = await Emotion.aggregate([
      {
        $match: {
          emotion: { $nin: ["No Face Detected", null, ""] }, // ✅ FILTER
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%H:%M",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const timeline = data.map((item) => ({
      time: item._id,
      detections: item.count,
    }));

    res.json({
      success: true,
      timeline,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Timeline analytics failed",
    });
  }
});


// ------------------------
// GREETING
// ------------------------
router.get("/greeting", protectRoute, async (req, res) => {  // ← add protectRoute
  try {
    const response = await axios.get(`${FLASK_CHAT_URL}/greeting`);  // ← remove params
    res.json(response.data);
  } catch (error) {
    console.error("Greeting error:", error.message);
    res.status(500).json({ reply: "Hi! I'm here for you 💙" });
  }
});

// ------------------------
// EMOTION DETECTED
// ------------------------
router.post("/emotion_detected", protectRoute, async (req, res) => {  // ← add protectRoute
  try {
    const response = await axios.post(`${FLASK_CHAT_URL}/emotion_detected`, {
      emotion: req.body.emotion,  // ← only send emotion, not userId
    });
    res.json(response.data);
  } catch (error) {
    console.error("Emotion detected error:", error.message);
    res.status(500).json({ reply: "I can see you're feeling something. I'm here 💙" });
  }
});






/*
--------------------------------
Emotion Percentage (GLOBAL)
--------------------------------
*/
router.get("/emotion/percentage", protectAdmin, async (req, res) => {
  try {

    const data = await Emotion.aggregate([
      {
        $match: {
          emotion: { $nin: ["No Face Detected", null, ""] }
        }
      },
      {
        $group: {
          _id: "$emotion",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = data.reduce((sum, item) => sum + item.count, 0);

    const percentage = data.map(item => ({
      emotion: item._id,
      count: item.count,
      percentage: total === 0 ? 0 : ((item.count / total) * 100).toFixed(2)
    }));

    res.json({
      success: true,
      total,
      data: percentage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate percentages"
    });
  }
});




/*
--------------------------------
Per User Emotion Breakdown
--------------------------------
*/
router.get("/emotion/user-breakdown", protectAdmin, async (req, res) => {
  try {

    const data = await Emotion.aggregate([
      {
        $match: {
          emotion: { $nin: ["No Face Detected", null, ""] }
        }
      },
      {
        $group: {
          _id: {
            user: "$user",
            emotion: "$emotion"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.user",
          emotions: {
            $push: {
              emotion: "$_id.emotion",
              count: "$count"
            }
          },
          total: { $sum: "$count" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      }
    ]);

    const result = data.map(user => ({
      userId: user._id,
      name: user.user.name,
      email: user.user.email,
      total: user.total,
      emotions: user.emotions.map(e => ({
        emotion: e.emotion,
        count: e.count,
        percentage: ((e.count / user.total) * 100).toFixed(2)
      }))
    }));

    res.json({
      success: true,
      users: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User breakdown failed"
    });
  }
});




/*
--------------------------------
Single User Emotion Breakdown
--------------------------------
*/
router.get("/emotion/user/:user_id", protectAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Emotion.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          emotion: { $nin: ["No Face Detected", null, ""] }
        }
      },
      {
        $group: {
          _id: "$emotion",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = stats.reduce((sum, e) => sum + e.count, 0);

    const breakdown = stats.map(e => ({
      emotion: e._id,
      count: e.count,
      percentage: total === 0 ? 0 : ((e.count / total) * 100).toFixed(2)
    }));

    res.json({
      success: true,
      total,
      breakdown
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User breakdown failed"
    });
  }
});





export default router;