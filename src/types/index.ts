export interface RegistrationFormData {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  email: string;
  password: string;
  aadhaar: string;
  pan: string;
  permanentAddress: string;
  state: string;
  city: string;
  pincode: string;
  photo: File | null;
  video: File | null;
}

export interface Submission extends Omit<RegistrationFormData, 'photo' | 'video'> {
  id: string;
  photoUrl: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}