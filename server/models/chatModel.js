import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  question: String,
  subject: String,
  answer: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Chat", chatSchema);
