import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a valid image file (JPG or PNG)'), false);
    }
  } else if (file.fieldname === 'video') {
    if (!file.originalname.match(/\.(mp4|mov)$/)) {
      return cb(new Error('Please upload a valid video file (MP4 or MOV)'), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: {
      photo: 5 * 1024 * 1024, // 5MB
      video: 10 * 1024 * 1024 // 10MB
    }
  }
});

export default upload;