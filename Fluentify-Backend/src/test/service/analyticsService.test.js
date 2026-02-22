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

describe('analyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackLessonCompletion', () => {
    it('logs event successfully', async () => {
      mockRepo.logEvent.mockResolvedValueOnce({ id: 1 });
      await service.trackLessonCompletion(1, 'English', 'VOCAB', 60, { lessonId: 10, unitId: 2, courseId: 3, score: 80, xpEarned: 50, exercisesCompleted: 5 });
      expect(mockRepo.logEvent).toHaveBeenCalled();
    });

    it('propagates error', async () => {
      mockRepo.logEvent.mockRejectedValueOnce(new Error('fail'));
      await expect(service.trackLessonCompletion(1, 'English', 'VOCAB')).rejects.toThrow('fail');
    });
  });

  describe('trackAIGeneration', () => {
    it('logs AI generation', async () => {
      mockRepo.logEvent.mockResolvedValueOnce({});
      await service.trackAIGeneration(1, 'English', true, { courseId: 9, unitsGenerated: 2, lessonsGenerated: 10, generationTime: 1234 });
      expect(mockRepo.logEvent).toHaveBeenCalled();
    });

    it('error path', async () => {
      mockRepo.logEvent.mockRejectedValueOnce(new Error('boom'));
      await expect(service.trackAIGeneration(1, 'English', false, { errorMessage: 'x' })).rejects.toThrow('boom');
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
      mockRepo.logEvent.mockRejectedValueOnce(new Error('err'));
      await expect(service.trackAdminModuleUsage(2, 'English', 'CREATE_COURSE', {})).rejects.toThrow('err');
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
      mockRepo.getRealTimeStats.mockRejectedValueOnce(new Error('rt'));
      mockRepo.getLanguageDistribution.mockRejectedValueOnce(new Error('lang'));
      mockRepo.getModuleUsage.mockRejectedValueOnce(new Error('mod'));
      mockRepo.getAIPerformance.mockRejectedValueOnce(new Error('ai'));
      mockRepo.getDailyActivity.mockRejectedValueOnce(new Error('daily'));
      mockRepo.getUserEngagement.mockRejectedValueOnce(new Error('eng'));
      mockRepo.getLessonCompletionTrends.mockRejectedValueOnce(new Error('trend'));
      mockRepo.getAverageLessonDuration.mockRejectedValueOnce(new Error('avg'));

      const res = await service.getAnalytics();
      expect(res.realTimeStats).toBeTruthy();
      expect(Array.isArray(res.languageDistribution)).toBe(true);
      expect(Array.isArray(res.moduleUsage)).toBe(true);
      expect(res.aiPerformance).toBeTruthy();
      expect(Array.isArray(res.dailyActivity)).toBe(true);
      expect(res.userEngagement).toBeTruthy();
      expect(Array.isArray(res.lessonCompletionTrends)).toBe(true);
      expect(Array.isArray(res.averageDuration)).toBe(true);
      expect(res.summary).toBeTruthy();
    });

    it('throws helpful message when table does not exist', async () => {
      mockRepo.getRealTimeStats.mockImplementationOnce(() => { throw new Error('relation "analytics" does not exist'); });
      await expect(service.getAnalytics()).rejects.toThrow('Analytics table not found. Please run the analytics migration script.');
    });

    it('rethrows non-migration errors from getAnalytics', async () => {
      const genericError = new Error('something else failed');
      mockRepo.getRealTimeStats.mockImplementationOnce(() => { throw genericError; });
      await expect(service.getAnalytics()).rejects.toBe(genericError);
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

    it('propagates error', async () => {
      mockRepo.getDailyActivity.mockRejectedValueOnce(new Error('nope'));
      await expect(service.getAnalyticsForPeriod(7)).rejects.toThrow('nope');
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
      expect(s1.aiSuccessRate).toBe('100%'); // totalGenerations from realtime > 0 sets 100%
      expect(s1.avgLessonsPerUser).toBe('10.0'); // 100/10

      const data2 = {
        realTimeStats: { popular_language: '', total_lessons: 0, active_users: 0, ai_courses_generated: 0 },
        languageDistribution: [{ language_name: 'French', count: 7 }],
        moduleUsage: [{ module_type: 'ADMIN', count: 5 }],
        aiPerformance: { total_generations: 10, success_count: 7 },
        userEngagement: { total_active_users: 4, avg_lessons_per_user: 3.5 }
      };
      const s2 = service._generateSummary(data2);
      expect(s2.mostPopularLanguage).toBe('French');
      expect(s2.totalLessons).toBe(0 + 7); // fallback sum
      expect(s2.preferredModule).toBe('ADMIN');
      expect(s2.aiSuccessRate).toBe('70.0%');
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
      expect(summary.mostPopularLanguage).toBe('N/A');
      expect(summary.totalLessons).toBe(0);
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
