import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatModel from "../models/chatModel.js"; // Optional for saving history

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLEGENAI);

router.post("/", async (req, res) => {
  try {
    const { question, subject } = req.body;

    if (!question || !subject) {
      return res
        .status(400)
        .json({ error: "Both question and subject are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a subject expert in ${subject}.
Only answer questions related to ${subject}.
If the user asks something unrelated, respond with:
"Sorry, I can only answer questions related to ${subject}."

Question: ${question}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = await response.text();

    // Optional: Save to MongoDB
    await chatModel.create({ question, subject, answer });

    res.json({ message: answer });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/history", async (req, res) => {
  try {
    console.log("Fetching chat history...");
    const history = await chatModel.find().sort({ createdAt: -1 });
    console.log("Chat history:", history);
    res.json({ success: true, history });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
