import express from 'express';
import analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

// Note: Authentication and admin check are handled by parent admin routes

/**
 * @route GET /api/admin/analytics
 * @desc Get comprehensive platform analytics
 * @access Admin only
 */
router.get('/', analyticsController.getPlatformAnalytics);

/**
 * @route GET /api/admin/analytics/period
 * @desc Get analytics for a specific time period
 * @query days - Number of days to look back (default: 30)
 * @access Admin only
 */
router.get('/period', analyticsController.getAnalyticsForPeriod);

/**
 * @route GET /api/admin/analytics/languages
 * @desc Get language distribution statistics
 * @access Admin only
 */
router.get('/languages', analyticsController.getLanguageDistribution);

/**
 * @route GET /api/admin/analytics/modules
 * @desc Get module usage statistics (Admin vs AI)
 * @access Admin only
 */
router.get('/modules', analyticsController.getModuleUsage);

/**
 * @route GET /api/admin/analytics/engagement
 * @desc Get user engagement metrics
 * @access Admin only
 */
router.get('/engagement', analyticsController.getUserEngagement);

/**
 * @route GET /api/admin/analytics/trends
 * @desc Get lesson completion trends
 * @query days - Number of days to look back (default: 30)
 * @access Admin only
 */
router.get('/trends', analyticsController.getLessonCompletionTrends);

export default router;
