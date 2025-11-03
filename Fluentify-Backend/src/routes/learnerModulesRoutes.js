import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import moduleAdminController from '../controllers/moduleAdminController.js';

const router = express.Router();

// Protect all routes below with authentication (learner only, no admin check)
router.use(authMiddleware);

// ==================== Language Routes (Read-only for learners) ====================
// Get list of unique published languages
router.get('/languages', moduleAdminController.getPublishedLanguages);

// Get published courses for a specific language
router.get('/languages/:lang/courses', moduleAdminController.getPublishedCoursesByLanguage);

// ==================== Course (Module) Routes (Read-only for learners) ====================
// Get a single published course with units and lessons
router.get('/courses/:courseId', moduleAdminController.getPublishedCourseDetails);

export default router;
