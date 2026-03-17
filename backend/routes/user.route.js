import express from "express";
import User from "../models/User.js";

const router = express.Router();


// GET ALL USERS
router.get("/users", async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json({
      success: true,
      users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });

  }
});

export default router;