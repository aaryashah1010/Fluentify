import fileUploadService from '../services/fileUploadService.js';
import moduleAdminRepository from '../repositories/moduleAdminRepository.js';

/**
 * File Upload Controller
 * Handles media file uploads for admin lesson management
 */
class FileUploadController {
  /**
   * Upload a lesson media file (PDF, Audio, Video)
   * POST /api/admin/upload/lesson-media
   */
  async uploadLessonMedia(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { language, courseNumber, unitNumber, lessonNumber, contentType } = req.body;

      // Validate required fields
      if (!language || !courseNumber || !unitNumber || !lessonNumber) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: language, courseNumber, unitNumber, lessonNumber'
        });
      }

      // Validate file type
      const isValidType = fileUploadService.validateFileType(req.file.mimetype, contentType || 'pdf');
      if (!isValidType) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type for ${contentType || 'pdf'} content`
        });
      }

      // Check file size
      const maxSize = fileUploadService.getMaxFileSize(contentType || 'pdf');
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds maximum allowed (${Math.round(maxSize / 1024 / 1024)}MB)`
        });
      }

      // Upload file
      const result = await fileUploadService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        {
          language,
          courseNumber: parseInt(courseNumber),
          unitNumber: parseInt(unitNumber),
          lessonNumber: parseInt(lessonNumber)
        }
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          url: result.url,
          filename: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
          manualUploadRequired: result.manualUploadRequired || false
        }
      });
    } catch (error) {
      console.error('Error uploading lesson media:', error);
      next(error);
    }
  }

  /**
   * Upload media and update lesson
   * POST /api/admin/lessons/:lessonId/upload-media
   */
  async uploadAndUpdateLesson(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const { lessonId } = req.params;
      const { language, courseNumber, unitNumber, lessonNumber, contentType } = req.body;

      // Validate required fields
      if (!language || !courseNumber || !unitNumber || !lessonNumber) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: language, courseNumber, unitNumber, lessonNumber'
        });
      }

      // Validate file type
      const isValidType = fileUploadService.validateFileType(req.file.mimetype, contentType || 'pdf');
      if (!isValidType) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type for ${contentType || 'pdf'} content`
        });
      }

      // Upload file
      const result = await fileUploadService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        {
          language,
          courseNumber: parseInt(courseNumber),
          unitNumber: parseInt(unitNumber),
          lessonNumber: parseInt(lessonNumber)
        }
      );

      // Update lesson with media URL
      const updatedLesson = await moduleAdminRepository.updateLesson(lessonId, {
        media_url: result.url
      });

      res.status(200).json({
        success: true,
        message: 'Media uploaded and lesson updated successfully',
        data: {
          lesson: updatedLesson,
          media: {
            url: result.url,
            filename: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            manualUploadRequired: result.manualUploadRequired || false
          }
        }
      });
    } catch (error) {
      console.error('Error uploading and updating lesson:', error);
      next(error);
    }
  }

  /**
   * Get course number for a language
   * Used to determine if this is course 1 or 2 for the language
   * GET /api/admin/languages/:lang/course-count
   */
  async getCourseCountForLanguage(req, res, next) {
    try {
      const { lang } = req.params;
      
      const courses = await moduleAdminRepository.getCoursesByLanguage(lang);
      const courseCount = courses.length;
      
      res.status(200).json({
        success: true,
        data: {
          language: lang,
          existingCourses: courseCount,
          nextCourseNumber: courseCount + 1
        }
      });
    } catch (error) {
      console.error('Error getting course count:', error);
      next(error);
    }
  }
}

export default new FileUploadController();
