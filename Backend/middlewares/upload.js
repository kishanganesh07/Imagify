import multer from 'multer';

// Use memory storage so we can process with Sharp BEFORE saving anywhere
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file! Please upload only JPG, PNG or WEBP.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB strict limit
  },
  fileFilter: fileFilter
});

export default upload;
