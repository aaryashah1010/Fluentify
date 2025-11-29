import { jest } from '@jest/globals';

// Mock analyticsRepository
const mockRepo = {
  logEvent: jest.fn(),
  getRealTimeStats: jest.fn(),
  getLanguageDistribution: jest.fn(),
  getModuleUsage: jest.fn(),
  getAIPerformance: jest.fn(),
  getDailyActivity: jest.fn(),
  getUserEngagement: jest.fn(),
  getLessonCompletionTrends: jest.fn(),
  getAverageLessonDuration: jest.fn(),
};
await jest.unstable_mockModule('../../repositories/analyticsRepository.js', () => ({ default: mockRepo }));

const service = (await import('../../services/analyticsService.js')).default;

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('analyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
    consoleWarnSpy.mockClear();
  });

  describe('trackLessonCompletion', () => {
    it('logs event successfully with metadata and console output', async () => {
      const details = { lessonId: 10, unitId: 2, courseId: 3, score: 80, xpEarned: 50, exercisesCompleted: 5 };
      const logResult = { id: 1 };
      mockRepo.logEvent.mockResolvedValueOnce(logResult);
      await service.trackLessonCompletion(1, 'English', 'VOCAB', 60, details);
      expect(mockRepo.logEvent).toHaveBeenCalledWith(1, 'LESSON_COMPLETED', 'English', 'VOCAB', 60, details);
      expect(consoleLogSpy).toHaveBeenCalledWith('📊 Analytics Service - trackLessonCompletion called:', expect.objectContaining({ userId: 1, lessonDetails: details }));
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Analytics Service - Event logged successfully:', logResult);
    });

    it('propagates error', async () => {
      const err = new Error('fail');
      mockRepo.logEvent.mockRejectedValueOnce(err);
      await expect(service.trackLessonCompletion(1, 'English', 'VOCAB')).rejects.toThrow('fail');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Analytics Service - Error tracking lesson completion:', err);
    });
  });

  describe('trackAIGeneration', () => {
    it('logs AI generation', async () => {
      mockRepo.logEvent.mockResolvedValueOnce({});
      await service.trackAIGeneration(1, 'English', true, { courseId: 9, unitsGenerated: 2, lessonsGenerated: 10, generationTime: 1234 });
      expect(mockRepo.logEvent).toHaveBeenCalled();
    });

    it('error path', async () => {
      const err = new Error('boom');
      mockRepo.logEvent.mockRejectedValueOnce(err);
      await expect(service.trackAIGeneration(1, 'English', false, { errorMessage: 'x' })).rejects.toThrow('boom');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error tracking AI generation:', err);
    });

    it('uses default success and details when omitted', async () => {
      mockRepo.logEvent.mockResolvedValueOnce({});
      await service.trackAIGeneration(2, 'Spanish');
      expect(mockRepo.logEvent).toHaveBeenCalledWith(
        2,
        'AI_MODULE_GENERATED',
        'Spanish',
        'AI',
        undefined,
        expect.objectContaining({ success: true })
      );
    });
  });

  describe('trackAdminModuleUsage', () => {
    it('logs admin usage', async () => {
      mockRepo.logEvent.mockResolvedValueOnce({});
      await service.trackAdminModuleUsage(2, 'English', 'CREATE_COURSE', { courseId: 1, details: 'd' });
      expect(mockRepo.logEvent).toHaveBeenCalled();
    });

    it('error path', async () => {
      const err = new Error('err');
      mockRepo.logEvent.mockRejectedValueOnce(err);
      await expect(service.trackAdminModuleUsage(2, 'English', 'CREATE_COURSE', {})).rejects.toThrow('err');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error tracking admin module usage:', err);
    });

    it('uses default moduleDetails when omitted', async () => {
      mockRepo.logEvent.mockResolvedValueOnce({});
      await service.trackAdminModuleUsage(3, 'French', 'CREATE_COURSE');
      expect(mockRepo.logEvent).toHaveBeenCalledWith(
        3,
        'ADMIN_MODULE_USED',
        'French',
        'ADMIN',
        null,
        expect.objectContaining({ actionType: 'CREATE_COURSE' })
      );
    });
  });

  describe('getAnalytics', () => {
    it('returns combined analytics with fallbacks triggered', async () => {
      const rtError = new Error('rt');
      const langError = new Error('lang');
      const modError = new Error('mod');
      const aiError = new Error('ai');
      const dailyError = new Error('daily');
      const engError = new Error('eng');
      const trendError = new Error('trend');
      const avgError = new Error('avg');
      mockRepo.getRealTimeStats.mockRejectedValueOnce(rtError);
      mockRepo.getLanguageDistribution.mockRejectedValueOnce(langError);
      mockRepo.getModuleUsage.mockRejectedValueOnce(modError);
      mockRepo.getAIPerformance.mockRejectedValueOnce(aiError);
      mockRepo.getDailyActivity.mockRejectedValueOnce(dailyError);
      mockRepo.getUserEngagement.mockRejectedValueOnce(engError);
      mockRepo.getLessonCompletionTrends.mockRejectedValueOnce(trendError);
      mockRepo.getAverageLessonDuration.mockRejectedValueOnce(avgError);

      const res = await service.getAnalytics();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting real-time stats:', 'rt');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting language distribution:', 'lang');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting module usage:', 'mod');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting AI performance:', 'ai');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting daily activity:', 'daily');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting user engagement:', 'eng');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting lesson completion trends:', 'trend');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Error getting average lesson duration:', 'avg');
      expect(res.realTimeStats).toEqual({ total_lessons: 0, active_users: 0, popular_language: 'N/A', ai_courses_generated: 0, avg_generation_time: 0, total_xp_earned: 0 });
      expect(res.languageDistribution).toEqual([]);
      expect(res.moduleUsage).toEqual([]);
      expect(res.aiPerformance).toEqual({ total_generations: 0, success_count: 0, failure_count: 0 });
      expect(res.dailyActivity).toEqual([]);
      expect(res.userEngagement).toEqual({ total_active_users: 0, avg_lessons_per_user: 0, max_lessons_per_user: 0 });
      expect(res.lessonCompletionTrends).toEqual([]);
      expect(res.averageDuration).toEqual([]);
      expect(res.summary.totalActiveUsers).toBe(0);
    });

    it('throws helpful message when table does not exist', async () => {
      const err = new Error('relation "analytics" does not exist');
      mockRepo.getRealTimeStats.mockImplementationOnce(() => { throw err; });
      await expect(service.getAnalytics()).rejects.toThrow('Analytics table not found. Please run the analytics migration script.');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting analytics:', err);
    });

    it('rethrows non-migration errors from getAnalytics', async () => {
      const genericError = new Error('something else failed');
      mockRepo.getRealTimeStats.mockImplementationOnce(() => { throw genericError; });
      await expect(service.getAnalytics()).rejects.toBe(genericError);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting analytics:', genericError);
    });
  });

  describe('getAnalyticsForPeriod', () => {
    it('returns period analytics', async () => {
      mockRepo.getDailyActivity.mockResolvedValueOnce([1]);
      mockRepo.getLessonCompletionTrends.mockResolvedValueOnce([2]);
      const res = await service.getAnalyticsForPeriod(7);
      expect(res.period).toBe('7 days');
      expect(res.dailyActivity).toEqual([1]);
      expect(res.lessonCompletionTrends).toEqual([2]);
    });

    it('propagates error and logs message', async () => {
      const err = new Error('nope');
      mockRepo.getDailyActivity.mockRejectedValueOnce(err);
      await expect(service.getAnalyticsForPeriod(7)).rejects.toThrow('nope');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting analytics for period:', err);
    });

    it('uses default days=30 when no argument is provided', async () => {
      mockRepo.getDailyActivity.mockResolvedValueOnce([1]);
      mockRepo.getLessonCompletionTrends.mockResolvedValueOnce([2]);
      const res = await service.getAnalyticsForPeriod();
      expect(mockRepo.getDailyActivity).toHaveBeenCalledWith(30);
      expect(mockRepo.getLessonCompletionTrends).toHaveBeenCalledWith(30);
      expect(res.period).toBe('30 days');
    });
  });

  describe('_generateSummary', () => {
    it('computes preferredModule and rates across branches', () => {
      const data1 = {
        realTimeStats: { popular_language: 'Spanish', total_lessons: 100, active_users: 10, ai_courses_generated: 5 },
        languageDistribution: [{ language_name: 'English', count: 50 }],
        moduleUsage: [{ module_type: 'AI', count: 3 }],
        aiPerformance: { total_generations: 0, success_count: 0 },
        userEngagement: { total_active_users: 8, avg_lessons_per_user: 2 }
      };
      const s1 = service._generateSummary(data1);
      expect(s1.mostPopularLanguage).toBe('Spanish');
      expect(s1.totalLessons).toBe(100);
      expect(s1.preferredModule).toBe('AI');
      expect(s1.totalActiveUsers).toBe(10);
      expect(s1.aiSuccessRate).toBe('100%');
      expect(s1.avgLessonsPerUser).toBe('10.0');

      const data2 = {
        realTimeStats: { popular_language: '', total_lessons: 0, active_users: 0, ai_courses_generated: 0 },
        languageDistribution: [{ language_name: 'French', count: 7 }],
        moduleUsage: [{ module_type: 'ADMIN', count: 5 }],
        aiPerformance: { total_generations: 10, success_count: 7 },
        userEngagement: { total_active_users: 4, avg_lessons_per_user: 3.5 }
      };
      const s2 = service._generateSummary(data2);
      expect(s2.mostPopularLanguage).toBe('French');
      expect(s2.totalLessons).toBe(7);
      expect(s2.preferredModule).toBe('ADMIN');
      expect(s2.aiSuccessRate).toBe('70.0%');
      expect(s2.totalActiveUsers).toBe(4);
      expect(s2.avgLessonsPerUser).toBe('3.5');
    });

    it('handles case with no module usage or generations (N/A and 0%)', () => {
      const data = {
        realTimeStats: { popular_language: '', total_lessons: 0, active_users: 0, ai_courses_generated: 0 },
        languageDistribution: [],
        moduleUsage: [],
        aiPerformance: { total_generations: 0, success_count: 0 },
        userEngagement: { total_active_users: 0, avg_lessons_per_user: 0 },
      };

      const summary = service._generateSummary(data);
      expect(summary.totalLessons).toBe(0);
      expect(summary.totalActiveUsers).toBe(0);
      expect(summary.preferredModule).toBe('N/A');
      expect(summary.aiSuccessRate).toBe('0%');
      expect(summary.avgLessonsPerUser).toBe('0.0');
    });

    it('handles languageDistribution entries without count using count || 0', () => {
      const data = {
        realTimeStats: { popular_language: '', total_lessons: 0, active_users: 0, ai_courses_generated: 0 },
        languageDistribution: [
          { language_name: 'Italian' }, // no count field
          { language_name: 'German', count: '3' },
        ],
        moduleUsage: [],
        aiPerformance: { total_generations: 0, success_count: 0 },
        userEngagement: { total_active_users: 0, avg_lessons_per_user: 0 },
      };

      const summary = service._generateSummary(data);
      // totalLessons should be parseInt(0) + parseInt('3') => 3
      expect(summary.totalLessons).toBe(3);
    });
  });
});
