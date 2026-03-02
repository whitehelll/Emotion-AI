import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import emotionRouter from "./routes/emotion.route.js";
import chatRouter from "./routes/chat.route.js";
import authRouter from "./routes/auth.route.js";
import ollamaRouter from "./routes/ollamaChat.js";

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
app.use("/api/auth", authRouter);
app.use("/api", emotionRouter);
app.use("/api", chatRouter);
app.use("/api", ollamaRouter);

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