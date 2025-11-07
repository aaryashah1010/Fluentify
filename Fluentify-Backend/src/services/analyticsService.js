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
   */
  async getAnalytics() {
    try {
      const [
        languageDistribution,
        moduleUsage,
        aiPerformance,
        dailyActivity,
        userEngagement,
        lessonCompletionTrends,
        averageDuration
      ] = await Promise.all([
        analyticsRepository.getLanguageDistribution(),
        analyticsRepository.getModuleUsage(),
        analyticsRepository.getAIPerformance(),
        analyticsRepository.getDailyActivity(30),
        analyticsRepository.getUserEngagement(),
        analyticsRepository.getLessonCompletionTrends(30),
        analyticsRepository.getAverageLessonDuration()
      ]);

      return {
        languageDistribution,
        moduleUsage,
        aiPerformance,
        dailyActivity,
        userEngagement,
        lessonCompletionTrends,
        averageDuration,
        summary: this._generateSummary({
          languageDistribution,
          moduleUsage,
          aiPerformance,
          userEngagement
        })
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
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
   */
  _generateSummary(data) {
    const { languageDistribution, moduleUsage, aiPerformance, userEngagement } = data;
    
    // Most popular language
    const mostPopularLanguage = languageDistribution.length > 0 
      ? languageDistribution[0].language_name 
      : 'N/A';

    // Total lessons completed
    const totalLessons = languageDistribution.reduce((sum, lang) => sum + parseInt(lang.count), 0);

    // Module preference
    const adminLessons = moduleUsage.find(m => m.module_type === 'ADMIN')?.count || 0;
    const aiLessons = moduleUsage.find(m => m.module_type === 'AI')?.count || 0;
    const preferredModule = adminLessons > aiLessons ? 'ADMIN' : 'AI';

    // AI success rate
    const aiSuccessRate = aiPerformance.total_generations > 0 
      ? ((aiPerformance.success_count / aiPerformance.total_generations) * 100).toFixed(1)
      : 0;

    return {
      mostPopularLanguage,
      totalLessons,
      preferredModule,
      aiSuccessRate: `${aiSuccessRate}%`,
      totalActiveUsers: userEngagement.total_active_users,
      avgLessonsPerUser: parseFloat(userEngagement.avg_lessons_per_user || 0).toFixed(1)
    };
  }
}

export default new AnalyticsService();
