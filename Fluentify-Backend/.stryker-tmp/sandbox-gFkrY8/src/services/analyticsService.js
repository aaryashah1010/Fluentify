// @ts-nocheck
import analyticsRepository from '../repositories/analyticsRepository.js';

class AnalyticsService {
  /**
   * Track lesson completion
   */
  async trackLessonCompletion(userId, language, moduleType, duration = null, lessonDetails = {}) {
    try {
      console.log('📊 Analytics Service - trackLessonCompletion called:', {
        userId,
        language,
        moduleType,
        duration,
        lessonDetails
      });

      const metadata = {
        lessonId: lessonDetails.lessonId,
        unitId: lessonDetails.unitId,
        courseId: lessonDetails.courseId,
        score: lessonDetails.score,
        xpEarned: lessonDetails.xpEarned,
        exercisesCompleted: lessonDetails.exercisesCompleted
      };

      const result = await analyticsRepository.logEvent(
        userId,
        'LESSON_COMPLETED',
        language,
        moduleType,
        duration,
        metadata
      );

      console.log('✅ Analytics Service - Event logged successfully:', result);
    } catch (error) {
      console.error('❌ Analytics Service - Error tracking lesson completion:', error);
      throw error;
    }
  }

  /**
   * Track AI module generation
   */
  async trackAIGeneration(userId, language, success = true, generationDetails = {}) {
    try {
      const metadata = {
        success,
        courseId: generationDetails.courseId,
        unitsGenerated: generationDetails.unitsGenerated,
        lessonsGenerated: generationDetails.lessonsGenerated,
        generationTime: generationDetails.generationTime,
        errorMessage: generationDetails.errorMessage
      };

      await analyticsRepository.logEvent(
        userId,
        'AI_MODULE_GENERATED',
        language,
        'AI',
        generationDetails.generationTime,
        metadata
      );
    } catch (error) {
      console.error('Error tracking AI generation:', error);
      throw error;
    }
  }

  /**
   * Track admin module usage
   */
  async trackAdminModuleUsage(userId, language, actionType, moduleDetails = {}) {
    try {
      const metadata = {
        actionType, // 'CREATE_COURSE', 'CREATE_UNIT', 'CREATE_LESSON', 'UPDATE_COURSE', etc.
        courseId: moduleDetails.courseId,
        unitId: moduleDetails.unitId,
        lessonId: moduleDetails.lessonId,
        details: moduleDetails.details
      };

      await analyticsRepository.logEvent(
        userId,
        'ADMIN_MODULE_USED',
        language,
        'ADMIN',
        null,
        metadata
      );
    } catch (error) {
      console.error('Error tracking admin module usage:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive analytics data
   * FIX: Now includes real-time stats from database tables
   */
  async getAnalytics() {
    try {
      const [
        realTimeStats,
        languageDistribution,
        moduleUsage,
        aiPerformance,
        dailyActivity,
        userEngagement,
        lessonCompletionTrends,
        averageDuration
      ] = await Promise.all([
        analyticsRepository.getRealTimeStats().catch(err => {
          console.warn('Error getting real-time stats:', err.message);
          return { total_lessons: 0, active_users: 0, popular_language: 'N/A', ai_courses_generated: 0, avg_generation_time: 0, total_xp_earned: 0 };
        }),
        analyticsRepository.getLanguageDistribution().catch(err => {
          console.warn('Error getting language distribution:', err.message);
          return [];
        }),
        analyticsRepository.getModuleUsage().catch(err => {
          console.warn('Error getting module usage:', err.message);
          return [];
        }),
        analyticsRepository.getAIPerformance().catch(err => {
          console.warn('Error getting AI performance:', err.message);
          return { total_generations: 0, success_count: 0, failure_count: 0 };
        }),
        analyticsRepository.getDailyActivity(30).catch(err => {
          console.warn('Error getting daily activity:', err.message);
          return [];
        }),
        analyticsRepository.getUserEngagement().catch(err => {
          console.warn('Error getting user engagement:', err.message);
          return { total_active_users: 0, avg_lessons_per_user: 0, max_lessons_per_user: 0 };
        }),
        analyticsRepository.getLessonCompletionTrends(30).catch(err => {
          console.warn('Error getting lesson completion trends:', err.message);
          return [];
        }),
        analyticsRepository.getAverageLessonDuration().catch(err => {
          console.warn('Error getting average lesson duration:', err.message);
          return [];
        })
      ]);

      return {
        realTimeStats,
        languageDistribution,
        moduleUsage,
        aiPerformance,
        dailyActivity,
        userEngagement,
        lessonCompletionTrends,
        averageDuration,
        summary: this._generateSummary({
          realTimeStats,
          languageDistribution,
          moduleUsage,
          aiPerformance,
          userEngagement
        })
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      // If it's a "relation does not exist" error, provide helpful message
      if (error.message && error.message.includes('does not exist')) {
        throw new Error('Analytics table not found. Please run the analytics migration script.');
      }
      throw error;
    }
  }

  /**
   * Get analytics for a specific time period
   */
  async getAnalyticsForPeriod(days = 30) {
    try {
      const [
        dailyActivity,
        lessonCompletionTrends
      ] = await Promise.all([
        analyticsRepository.getDailyActivity(days),
        analyticsRepository.getLessonCompletionTrends(days)
      ]);

      return {
        dailyActivity,
        lessonCompletionTrends,
        period: `${days} days`
      };
    } catch (error) {
      console.error('Error getting analytics for period:', error);
      throw error;
    }
  }

  /**
   * Generate summary statistics
   * FIX: Now uses real-time stats as primary source
   */
  _generateSummary(data) {
    const { realTimeStats, languageDistribution, moduleUsage, aiPerformance, userEngagement } = data;

    // Use real-time stats as primary source
    const mostPopularLanguage = realTimeStats.popular_language || 
      (languageDistribution.length > 0 ? languageDistribution[0].language_name : 'N/A');

    const totalLessons = realTimeStats.total_lessons || 
      languageDistribution.reduce((sum, lang) => sum + parseInt(lang.count || 0), 0);

    // Module preference
    const adminLessons = moduleUsage.find(m => m.module_type === 'ADMIN')?.count || 0;
    const aiLessons = moduleUsage.find(m => m.module_type === 'AI')?.count || 0;
    const preferredModule = adminLessons > aiLessons ? 'ADMIN' : (aiLessons > 0 ? 'AI' : 'N/A');

    // AI success rate - use real-time data if available
    const totalGenerations = realTimeStats.ai_courses_generated || aiPerformance.total_generations || 0;
    const aiSuccessRate = aiPerformance.total_generations > 0 
      ? ((aiPerformance.success_count / aiPerformance.total_generations) * 100).toFixed(1)
      : (totalGenerations > 0 ? '100' : '0');

    return {
      mostPopularLanguage,
      totalLessons,
      totalActiveUsers: realTimeStats.active_users || userEngagement.total_active_users || 0,
      preferredModule,
      aiSuccessRate: `${aiSuccessRate}%`,
      avgLessonsPerUser: realTimeStats.active_users > 0 
        ? (totalLessons / realTimeStats.active_users).toFixed(1)
        : parseFloat(userEngagement.avg_lessons_per_user || 0).toFixed(1)
    };
  }
}

export default new AnalyticsService();
