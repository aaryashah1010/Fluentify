import multer from 'multer';

/**
 * Multer configuration for file uploads
 * Uses memory storage to handle files as buffers
 */

// Memory storage - files are stored in memory as Buffer
const storage = multer.memoryStorage();

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  // Allowed MIME types for lesson media
  const allowedTypes = [
    // PDF
    'application/pdf',
    // Audio
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/x-wav',
    // Video
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: PDF, MP3, WAV, OGG, MP4, WEBM`), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max (for videos)
    files: 1 // Only 1 file at a time
  }
});

// Export different upload handlers
export const uploadSingle = upload.single('file');
export const uploadMedia = upload.single('media');

// Error handler middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the maximum allowed limit'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

export default upload;
