// @ts-nocheck
import analyticsService from '../services/analyticsService.js';
import { successResponse } from '../utils/response.js';

class AnalyticsController {
  /**
   * Get platform analytics
   * GET /api/admin/analytics
   */
  async getPlatformAnalytics(req, res, next) {
    try {
      const analytics = await analyticsService.getAnalytics();
      res.json(successResponse(analytics, 'Platform analytics retrieved successfully'));
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      next(error);
    }
  }

  /**
   * Get analytics for a specific time period
   * GET /api/admin/analytics/period?days=30
   */
  async getAnalyticsForPeriod(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const analytics = await analyticsService.getAnalyticsForPeriod(parseInt(days));
      res.json(successResponse(analytics, `Analytics for ${days} days retrieved successfully`));
    } catch (error) {
      console.error('Error fetching period analytics:', error);
      next(error);
    }
  }

  /**
   * Get language distribution
   * GET /api/admin/analytics/languages
   */
  async getLanguageDistribution(req, res, next) {
    try {
      const languageData = await analyticsService.getAnalytics();
      res.json(successResponse(
        { languageDistribution: languageData.languageDistribution },
        'Language distribution retrieved successfully'
      ));
    } catch (error) {
      console.error('Error fetching language distribution:', error);
      next(error);
    }
  }

  /**
   * Get module usage statistics
   * GET /api/admin/analytics/modules
   */
  async getModuleUsage(req, res, next) {
    try {
      const moduleData = await analyticsService.getAnalytics();
      res.json(successResponse(
        { 
          moduleUsage: moduleData.moduleUsage,
          aiPerformance: moduleData.aiPerformance 
        },
        'Module usage statistics retrieved successfully'
      ));
    } catch (error) {
      console.error('Error fetching module usage:', error);
      next(error);
    }
  }

  /**
   * Get user engagement metrics
   * GET /api/admin/analytics/engagement
   */
  async getUserEngagement(req, res, next) {
    try {
      const engagementData = await analyticsService.getAnalytics();
      res.json(successResponse(
        { 
          userEngagement: engagementData.userEngagement,
          dailyActivity: engagementData.dailyActivity 
        },
        'User engagement metrics retrieved successfully'
      ));
    } catch (error) {
      console.error('Error fetching user engagement:', error);
      next(error);
    }
  }

  /**
   * Get lesson completion trends
   * GET /api/admin/analytics/trends?days=30
   */
  async getLessonCompletionTrends(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const trendsData = await analyticsService.getAnalyticsForPeriod(parseInt(days));
      res.json(successResponse(
        { lessonCompletionTrends: trendsData.lessonCompletionTrends },
        'Lesson completion trends retrieved successfully'
      ));
    } catch (error) {
      console.error('Error fetching lesson completion trends:', error);
      next(error);
    }
  }
}

export default new AnalyticsController();
