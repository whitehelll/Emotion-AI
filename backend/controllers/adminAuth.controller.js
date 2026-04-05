import { sendOTP } from "../lib/sendOTP.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Emotion from "../models/Emotion.js";


// ======================
// ADMIN SIGNUP
// ======================


export const getAdmin = async (req,res)=>{

  res.json({
    admin: req.admin
  });

};






export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const existing = await Admin.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const admin = await Admin.create({
      name,
      email,
      password,
      emailOTP: otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    // ✅ Send OTP email
    await sendOTP(email, otp);

    res.status(201).json({
      message: "OTP sent to admin email",
      email,
    });
  } catch (err) {
    console.log("ADMIN SIGNUP ERROR:", err); // 👈 ADD THIS
    res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
};

// ======================
// ADMIN LOGIN
// ======================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // ✅ VERIFY EMAIL FIRST
    if (!admin.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first",
        isVerified: false
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("admin_jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/"
    });

    res.json({
      success: true,
      role: "admin",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Login failed"
    });
  }
};


// ======================
// ADMIN LOGOUT
// ======================
export const adminLogout = (req,res)=>{

  res.clearCookie("admin_jwt");

  res.json({
    message:"Admin logged out"
  });

};


// to get all users either user role or admin role

export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      filter = "all" // all | active | new
    } = req.query;

    const query = {
      role: "user"
    };

    // 🔍 Search (name or email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // 🎯 Filters
    if (filter === "active") {
      query.lastLogin = {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // last 7 days
      };
    }

    if (filter === "new") {
      query.createdAt = {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      };
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};


// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({ role: "user" })   // ✅ filter here
//       .select("-password"); // optional: hide password

//     res.json(users);

//   } catch (err) {
//     console.error("GET USERS ERROR:", err);
//     res.status(500).json({
//       message: "Failed to fetch users"
//     });
//   }
// };

export const getAnalytics = async (req, res) => {
  try {
    const stats = await Emotion.aggregate([
      {
        $group: {
          _id: { $toLower: "$emotion" },   // normalize case
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" }
        }
      },
      {
        $project: {
          emotion: "$_id",
          count: 1,
          avgConfidence: { $round: ["$avgConfidence", 2] },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ stats });

  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({
      message: "Failed to fetch analytics"
    });
  }
};


export const getEmotionAnalytics = async (req, res) => {
  try {
    const { userId } = req.query;

    const matchStage = userId
      ? { user: new mongoose.Types.ObjectId(userId) }
      : {};

    const stats = await Emotion.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $toLower: "$emotion" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ stats });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};




export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const activeUsers = await User.countDocuments({
      role: "user",
      lastLogin: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    const newUsers = await User.countDocuments({
      role: "user",
      createdAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      totalUsers,
      activeUsers,
      newUsers
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch dashboard stats"
    });
  }
};




export const verifyAdminOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    if (admin.emailOTP != otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (admin.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    admin.isVerified = true;
    admin.emailOTP = null;
    admin.otpExpires = null;

    await admin.save();

    res.json({
      message: "Admin verified successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Verification failed"
    });
  }
};

