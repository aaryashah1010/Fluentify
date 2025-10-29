import express from 'express';
import authMiddleware, { adminOnly } from '../middlewares/authMiddleware.js';
import moduleAdminController from '../controllers/moduleAdminController.js';
import analyticsRoutes from './analytics.js';

const router = express.Router();

// Protect all routes below with authentication and admin check
router.use(authMiddleware, adminOnly);

// ==================== Language Routes (Read-only) ====================
// Get list of unique languages
router.get('/languages', moduleAdminController.getLanguages);

// Get courses for a specific language
router.get('/languages/:lang/courses', moduleAdminController.getCoursesByLanguage);

// ==================== Course (Module) Routes ====================
// Create a new course
router.post('/courses', moduleAdminController.createCourse);

// Get a single course with units and lessons
router.get('/courses/:courseId', moduleAdminController.getCourseDetails);

// Update a course
router.put('/courses/:courseId', moduleAdminController.updateCourse);

// Delete a course
router.delete('/courses/:courseId', moduleAdminController.deleteCourse);

// ==================== Unit (Volume) Routes ====================
// Add a unit to a course
router.post('/courses/:courseId/units', moduleAdminController.createUnit);

// Update a unit
router.put('/units/:unitId', moduleAdminController.updateUnit);

// Delete a unit
router.delete('/units/:unitId', moduleAdminController.deleteUnit);

// ==================== Lesson Routes ====================
// Add a lesson to a unit
router.post('/units/:unitId/lessons', moduleAdminController.createLesson);

// Update a lesson
router.put('/lessons/:lessonId', moduleAdminController.updateLesson);

// Delete a lesson
router.delete('/lessons/:lessonId', moduleAdminController.deleteLesson);

// ==================== Analytics Routes ====================
// Analytics routes (already protected by admin middleware)
router.use('/analytics', analyticsRoutes);

export default router;
