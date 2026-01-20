const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const emotionRouter = require("./routes/emotion");   // ✔ fixed
const chatRouter = require("./routes/chat");         // ✔ fixed

const connectDB = require("./config/db");

const app = express();

// ---------- CONNECT MONGO ----------
connectDB();

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "10mb" }));

app.use(cors({
  origin: "http://localhost:3001",   // React frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// ---------- ROUTES ----------
app.use("/api/auth", require("./routes/auth"));
app.use("/api", emotionRouter);
app.use("/api", chatRouter);
app.use("/api", require("./routes/ollamaChat"));

// ---------- HOME ROUTE ----------
app.get("/", (req, res) => {
  return res.json({
    status: "OK",
    message: "Emotion Chatbot Backend running"
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Node Server running on port ${PORT}`);
});
