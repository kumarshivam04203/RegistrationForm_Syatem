import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import registrationRoutes from "./routes/registration.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Registration API");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
