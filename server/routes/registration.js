import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Registration from '../models/Registration.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create registration
router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { files, body } = req;

    // Upload files to Cloudinary
    const [photoResult, videoResult] = await Promise.all([
      cloudinary.uploader.upload(files.photo[0].buffer.toString('base64'), {
        resource_type: 'image',
        folder: 'registrations/photos'
      }),
      cloudinary.uploader.upload(files.video[0].buffer.toString('base64'), {
        resource_type: 'video',
        folder: 'registrations/videos'
      })
    ]);

    const registration = new Registration({
      ...body,
      photoUrl: photoResult.secure_url,
      videoUrl: videoResult.secure_url
    });

    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all registrations (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, state, city, gender } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { mobile: new RegExp(search, 'i') },
        { aadhaar: new RegExp(search, 'i') }
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
      Registration.countDocuments(query)
    ]);

    res.json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single registration (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update registration (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete registration (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;