import express from "express";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Registration from "../models/Registration.js";
import { authenticateToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// 🔹 Helper to convert buffer to data URI
const getDataUri = (fileBuffer, mimetype) => {
  const base64 = fileBuffer.toString("base64");
  return `data:${mimetype};base64,${base64}`;
};

// 🔹 Registration (public)
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { files, body } = req;

      if (!files.photo || !files.video) {
        return res.status(400).json({ message: "Photo and video are required" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(body.password, 10);

      // Convert buffers to data URIs
      const photoDataUri = getDataUri(files.photo[0].buffer, files.photo[0].mimetype);
      const videoDataUri = getDataUri(files.video[0].buffer, files.video[0].mimetype);

      // Upload to Cloudinary
      const [photoResult, videoResult] = await Promise.all([
        cloudinary.uploader.upload(photoDataUri, {
          resource_type: "image",
          folder: "registrations/photos",
        }),
        cloudinary.uploader.upload(videoDataUri, {
          resource_type: "video",
          folder: "registrations/videos",
        }),
      ]);

      const registration = new Registration({
        ...body,
        password: hashedPassword,
        photoUrl: photoResult.secure_url,
        videoUrl: videoResult.secure_url,
      });

      await registration.save();

      // Create JWT token
      const token = jwt.sign(
        { id: registration._id, email: registration.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({ registration, token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    }
  }
);

// 🔐 Admin-only - Get all registrations
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, state, city, gender } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobile: new RegExp(search, "i") },
        { aadhaar: new RegExp(search, "i") },
      ];
    }

    if (state) query.state = state;
    if (city) query.city = city;
    if (gender) query.gender = gender;

    const [registrations, total] = await Promise.all([
      Registration.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Registration.countDocuments(query),
    ]);

    res.json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch registrations", error: error.message });
  }
});

// 🔐 Admin-only - Get one
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Not found" });
    res.json(registration);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// 🔐 Admin-only - Update
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

// 🔐 Admin-only - Delete
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

export default router;
