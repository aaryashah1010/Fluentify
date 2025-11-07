import express from 'express';
import courseController from '../controllers/courseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// ==================== PUBLIC ROUTES (No Authentication Required) ====================
// Get all languages with published courses
router.get('/public/languages', courseController.getPublishedLanguages);

// Get published courses for a specific language
router.get('/public/languages/:language/courses', courseController.getPublishedCoursesByLanguage);

// Get published course details with units and lessons
router.get('/public/courses/:courseId', courseController.getPublishedCourseDetails);

// ==================== PROTECTED ROUTES (Authentication Required) ====================
// All course routes below require authentication
router.use(authMiddleware);

// Generate a new course (streaming with SSE)
router.get('/generate-stream', courseController.generateCourseStream);

// Generate a new course (legacy - non-streaming)
router.post('/generate', courseController.generateCourse);

// Get learner's courses
router.get('/', courseController.getLearnerCourses);

// Get specific course details with progress
router.get('/:courseId', courseController.getCourseDetails);

// Delete a course and all related data
router.delete('/:courseId', courseController.deleteCourse);

// Get specific lesson details (with unit ID)
router.get('/:courseId/units/:unitId/lessons/:lessonId', courseController.getLessonDetails);

// Get specific lesson details (backward compatible - without unit ID in URL)
router.get('/:courseId/lessons/:lessonId', courseController.getLessonDetailsLegacy);

// Mark lesson as complete (backward compatible - without unit ID in URL)
router.post('/:courseId/lessons/:lessonId/complete', courseController.completeLessonLegacy);

export default router;
