import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import emotionRouter from "./routes/emotion.route.js";
import chatRouter from "./routes/chat.route.js";
import authRouter from "./routes/auth.route.js";

import speechRoute from "./routes/speech.route.js";
import userRouter from "./routes/user.route.js";
import adminAuthRouter from "./routes/adminAuth.route.js";

import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// ---------- CONNECT MONGO ----------
connectDB();

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "10mb" }));

app.use(cors({
  origin: "http://localhost:3000", // React/Vite frontend
  credentials: true
}));
app.use(cookieParser());

// ---------- ROUTES ----------
app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/auth", authRouter);
app.use("/api", emotionRouter);
app.use("/api", chatRouter);

app.use("/api/speech", speechRoute);
app.use("/api", userRouter);
// ---------- HOME ROUTE ----------
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Emotion AI Backend running"
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});