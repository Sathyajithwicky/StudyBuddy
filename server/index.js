import axios from "axios"; // Make sure axios is imported
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import messagesRoutes from "./routes/messages.js";
import rateLimit from "express-rate-limit";
import { OpenAI } from "openai";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();

const geminiAPI = new GoogleGenAI({
  apiKey: process.env.GOOGLEGENAI,
});

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Your React app's URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

// Make sure these are before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add OPTIONS handling for preflight requests
app.options("*", cors()); // Enable pre-flight for all routes

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request Body:", req.body);
  next();
});

// Basic test route
app.get("/test", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      message: "Server is working!",
      mongoDbStatus: dbStatus[dbState],
      database: mongoose.connection.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking database status",
      error: error.message,
    });
  }
});

// Apply rate limiter before routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply limiter to all auth routes
app.use("/api/auth", limiter);

// Mount auth routes after limiter
app.use("/api/auth", authRoutes);

// Add this with your other routes
app.use("/api/messages", messagesRoutes);

// Chatbot Route - Using open ai
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [{ role: "user", content: message }],
    // });

    const response = await geminiAPI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });

    const botMessage = response.text;
    res.json({ message: botMessage });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Test route for OpenAI API

// 404 handler
app.use((req, res) => {
  console.log("404 for:", req.method, req.url);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "studentdb", // This specifies the database name
    });

    console.log("✅ MongoDB Atlas Connected Successfully!");
    console.log("Connected to database:", mongoose.connection.name);

    // Test the connection by trying to list collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((col) => col.name)
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Connect to MongoDB before starting server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log("\nAvailable routes:");
      console.log("GET  /test");
      console.log("POST /api/auth/register");
      console.log("POST /api/auth/login");
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
  });
