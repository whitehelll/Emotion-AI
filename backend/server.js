
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emotionRouter from "./routes/emotion.js";
import chatRouter from "./routes/chat.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Emotion Chatbot Backend running" });
});

app.use("/api", emotionRouter);
app.use("/api", chatRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express backend listening on port ${PORT}`);
});
