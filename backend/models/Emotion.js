import mongoose from "mongoose";

const emotionSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  emotion: {
    type: String,
    required: true
  },

  confidence: Number,

}, { timestamps: true });

const Emotion = mongoose.model("Emotion", emotionSchema);

export default Emotion;