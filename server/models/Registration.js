import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  aadhaar: { type: String, required: true },
  pan: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  photoUrl: { type: String, required: true },
  videoUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);