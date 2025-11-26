import axios from 'axios';
import FormData from 'form-data';
import path from 'path';

/**
 * File Upload Service
 * Uploads lesson media files to external server via HTTP
 * URL Structure: https://inventory.newtechtest.in/LanguagePDF/{Language}{CourseNumber}/Unit{X}/L{Y}/{filename}
 */
class FileUploadService {
  constructor() {
    // Public URL base for accessing files
    this.publicBaseUrl = process.env.MEDIA_SERVER_URL || 'https://inventory.newtechtest.in/LanguagePDF';
    // Upload endpoint (the script you will put on the server)
    this.uploadEndpoint = process.env.MEDIA_UPLOAD_ENDPOINT || 'https://inventory.newtechtest.in/upload.php';
    // API Key (must match the one in the PHP script)
    this.uploadApiKey = process.env.MEDIA_UPLOAD_API_KEY || 'fluentify_secure_upload_key_2024';
  }

  /**
   * Generate the folder path for a lesson media file
   * @param {string} language - Course language (e.g., 'Hindi', 'Spanish')
   * @param {number} courseNumber - Course number for this language (1 or 2)
   * @param {number} unitNumber - Unit number (1-6)
   * @param {number} lessonNumber - Lesson number within unit (1-6)
   * @returns {string} - Folder path like 'Hindi1/Unit1/L1'
   */
  generateFolderPath(language, courseNumber, unitNumber, lessonNumber) {
    const langFolder = `${language}${courseNumber}`;
    const unitFolder = `Unit${unitNumber}`;
    const lessonFolder = `L${lessonNumber}`;
    return `${langFolder}/${unitFolder}/${lessonFolder}`;
  }

  /**
   * Generate the full public URL for a media file
   */
  generatePublicUrl(language, courseNumber, unitNumber, lessonNumber, filename) {
    const folderPath = this.generateFolderPath(language, courseNumber, unitNumber, lessonNumber);
    return `${this.publicBaseUrl}/${folderPath}/${filename}`;
  }

  /**
   * Upload a file to external server via HTTP
   * @param {Buffer} fileBuffer - File content as buffer
   * @param {string} filename - Original filename
   * @param {string} mimeType - File MIME type
   * @param {Object} pathInfo - Path information
   * @returns {Promise<{success: boolean, url: string, message: string}>}
   */
  async uploadFile(fileBuffer, filename, mimeType, pathInfo) {
    const { language, courseNumber, unitNumber, lessonNumber } = pathInfo;

    try {
      // Generate sanitized filename
      const sanitizedFilename = this.sanitizeFilename(filename);
      const folderPath = this.generateFolderPath(language, courseNumber, unitNumber, lessonNumber);
      
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: sanitizedFilename,
        contentType: mimeType
      });
      formData.append('path', folderPath);
      formData.append('api_key', this.uploadApiKey);

      console.log(`Uploading to: ${this.uploadEndpoint}`);
      console.log(`Target folder: ${folderPath}`);

      const response = await axios.post(this.uploadEndpoint, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.uploadApiKey}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      if (response.data && response.data.success) {
        const publicUrl = this.generatePublicUrl(language, courseNumber, unitNumber, lessonNumber, sanitizedFilename);
        return {
          success: true,
          url: publicUrl,
          message: 'File uploaded successfully'
        };
      } else {
        throw new Error(response.data?.message || 'Upload failed');
      }

    } catch (error) {
      // Extract detailed error from response if available
      const serverError = error.response?.data?.message || error.message;
      console.error('HTTP upload error:', serverError);
      
      // Throw more specific error
      if (error.response?.status === 401) {
        throw new Error('Upload failed: Invalid API Key');
      } else if (error.response?.status === 500) {
        throw new Error(`Upload failed: Server error (${serverError}). Check folder permissions.`);
      }
      
      throw new Error(`Failed to upload file: ${serverError}`);
    }
  }

  /**
   * Sanitize filename to be URL-safe
   * @param {string} filename 
   * @returns {string}
   */
  sanitizeFilename(filename) {
    // Get extension
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    
    // Remove special characters, replace spaces with underscores
    const sanitized = name
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50); // Limit length
    
    return `${sanitized}${ext}`.toLowerCase();
  }

  /**
   * Get content type based on file extension
   * @param {string} filename 
   * @returns {string}
   */
  getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Validate file type for lessons
   * @param {string} mimeType 
   * @param {string} contentType - Expected content type (pdf, audio, video)
   * @returns {boolean}
   */
  validateFileType(mimeType, contentType) {
    const allowedTypes = {
      pdf: ['application/pdf'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav'],
      video: ['video/mp4', 'video/webm', 'video/quicktime']
    };
    
    const allowed = allowedTypes[contentType] || [];
    return allowed.includes(mimeType);
  }

  /**
   * Get maximum file size for content type (in bytes)
   * @param {string} contentType 
   * @returns {number}
   */
  getMaxFileSize(contentType) {
    const maxSizes = {
      pdf: 50 * 1024 * 1024,   // 50MB
      audio: 100 * 1024 * 1024, // 100MB
      video: 500 * 1024 * 1024  // 500MB
    };
    return maxSizes[contentType] || 50 * 1024 * 1024;
  }
}

export default new FileUploadService();
