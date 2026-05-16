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
import path from "path";

dotenv.config();

const app = express();

// ---------- CONNECT MONGO ----------
connectDB();

const __dirname=path.resolve();

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "10mb" }));

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? true   // allow same-origin (Render/Vercel)
    : "http://localhost:3000",
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

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // ✅ SAFE fallback (NO PATH STRING)
  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "build", "index.html")
    );
  });
}


// ---------- START SERVER ----------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});