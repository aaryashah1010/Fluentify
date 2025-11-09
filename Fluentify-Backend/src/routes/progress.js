import express from 'express';
import { getCourseProgress, markLessonComplete, getUserCourses, getProgressReport } from '../controllers/progressController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get user's all courses
router.get('/courses', authMiddleware, getUserCourses);

// Get course progress with units and lessons
router.get('/courses/:courseId', authMiddleware, getCourseProgress);

// Get detailed progress report for a course
// Query params: timeRange (7days, 30days, 90days, all) - default: 30days
router.get('/courses/:courseId/report', authMiddleware, getProgressReport);

// Mark lesson as complete
router.post('/courses/:courseId/units/:unitId/lessons/:lessonId/complete',
  authMiddleware,
  markLessonComplete
);

export default router;
