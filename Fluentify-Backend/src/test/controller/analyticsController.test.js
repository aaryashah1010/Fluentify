import { jest } from '@jest/globals';

// --- ESM-safe mocks BEFORE importing the controller ---
const mockAnalytics = {
  totalUsers: 1000,
  languageDistribution: { en: 600, es: 400 },
  moduleUsage: { courseA: 300, courseB: 700 },
  aiPerformance: { latency: '150ms' },
  userEngagement: { avgSession: '10min' },
  dailyActivity: [{ date: '2025-11-18', value: 50 }],
  lessonCompletionTrends: [{ date: '2025-11-18', completed: 10 }]
};

const mockPeriodAnalytics = {
  lessonCompletionTrends: [{ date: '2025-11-01', completed: 5 }]
};

const mockAnalyticsService = {
  getAnalytics: jest.fn().mockResolvedValue(mockAnalytics),
  getAnalyticsForPeriod: jest.fn().mockResolvedValue(mockPeriodAnalytics)
};
await jest.unstable_mockModule('../../services/analyticsService.js', () => ({
  default: mockAnalyticsService
}));

const mockSuccessResponse = jest.fn((data, message) => ({ success: true, data, message }));
await jest.unstable_mockModule('../../utils/response.js', () => ({
  successResponse: mockSuccessResponse
}));

// Import the controller AFTER mocks are set up
const analyticsController = (await import('../../controllers/analyticsController.js')).default;

function createMockRes() {
  return { json: jest.fn() };
}
function createMockNext() { return jest.fn(); }

describe('analyticsController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { query: {} };
    res = createMockRes();
    next = createMockNext();
  });

  // Helper to test error path for a given service function and log prefix
  async function expectErrorPath(method, failingMockFn, expectedLogPrefix) {
    const err = new Error('Service failure');
    failingMockFn.mockRejectedValueOnce(err);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await method(req, res, next);

    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(err);
    expect(errorSpy).toHaveBeenCalledWith(expectedLogPrefix, err);

    errorSpy.mockRestore();
  }

  describe('getPlatformAnalytics', () => {
    it('returns platform analytics via successResponse', async () => {
      await analyticsController.getPlatformAnalytics(req, res, next);
      expect(mockAnalyticsService.getAnalytics).toHaveBeenCalledTimes(1);
      expect(mockSuccessResponse).toHaveBeenCalledWith(mockAnalytics, 'Platform analytics retrieved successfully');
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockAnalytics, message: 'Platform analytics retrieved successfully' });
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors to next and logs platform analytics failure', async () => {
      await expectErrorPath(
        analyticsController.getPlatformAnalytics.bind(analyticsController),
        mockAnalyticsService.getAnalytics,
        'Error fetching platform analytics:',
      );
    });
  });

  describe('getAnalyticsForPeriod', () => {
    it('uses default 30 days when no query provided', async () => {
      await analyticsController.getAnalyticsForPeriod(req, res, next);
      expect(mockAnalyticsService.getAnalyticsForPeriod).toHaveBeenCalledWith(30);
      expect(mockSuccessResponse).toHaveBeenCalledWith(mockPeriodAnalytics, 'Analytics for 30 days retrieved successfully');
      expect(res.json).toHaveBeenCalled();
    });

    it('parses days from query and passes integer', async () => {
      req.query.days = '7';
      await analyticsController.getAnalyticsForPeriod(req, res, next);
      expect(mockAnalyticsService.getAnalyticsForPeriod).toHaveBeenCalledWith(7);
      expect(mockSuccessResponse).toHaveBeenCalledWith(mockPeriodAnalytics, 'Analytics for 7 days retrieved successfully');
    });

    it('forwards errors to next and logs period analytics failure', async () => {
      await expectErrorPath(
        analyticsController.getAnalyticsForPeriod.bind(analyticsController),
        mockAnalyticsService.getAnalyticsForPeriod,
        'Error fetching period analytics:',
      );
    });
  });

  describe('getLanguageDistribution', () => {
    it('returns only languageDistribution wrapped in successResponse', async () => {
      await analyticsController.getLanguageDistribution(req, res, next);
      expect(mockAnalyticsService.getAnalytics).toHaveBeenCalled();
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { languageDistribution: mockAnalytics.languageDistribution },
        'Language distribution retrieved successfully'
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('forwards errors to next and logs language distribution failure', async () => {
      await expectErrorPath(
        analyticsController.getLanguageDistribution.bind(analyticsController),
        mockAnalyticsService.getAnalytics,
        'Error fetching language distribution:',
      );
    });
  });

  describe('getModuleUsage', () => {
    it('returns moduleUsage and aiPerformance', async () => {
      await analyticsController.getModuleUsage(req, res, next);
      expect(mockAnalyticsService.getAnalytics).toHaveBeenCalled();
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { moduleUsage: mockAnalytics.moduleUsage, aiPerformance: mockAnalytics.aiPerformance },
        'Module usage statistics retrieved successfully'
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('forwards errors to next and logs module usage failure', async () => {
      await expectErrorPath(
        analyticsController.getModuleUsage.bind(analyticsController),
        mockAnalyticsService.getAnalytics,
        'Error fetching module usage:',
      );
    });
  });

  describe('getUserEngagement', () => {
    it('returns userEngagement and dailyActivity', async () => {
      await analyticsController.getUserEngagement(req, res, next);
      expect(mockAnalyticsService.getAnalytics).toHaveBeenCalled();
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { userEngagement: mockAnalytics.userEngagement, dailyActivity: mockAnalytics.dailyActivity },
        'User engagement metrics retrieved successfully'
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('forwards errors to next and logs user engagement failure', async () => {
      await expectErrorPath(
        analyticsController.getUserEngagement.bind(analyticsController),
        mockAnalyticsService.getAnalytics,
        'Error fetching user engagement:',
      );
    });
  });

  describe('getLessonCompletionTrends', () => {
    it('uses default 30 days when not provided', async () => {
      await analyticsController.getLessonCompletionTrends(req, res, next);
      expect(mockAnalyticsService.getAnalyticsForPeriod).toHaveBeenCalledWith(30);
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { lessonCompletionTrends: mockPeriodAnalytics.lessonCompletionTrends },
        'Lesson completion trends retrieved successfully'
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('parses days from query and passes integer', async () => {
      req.query.days = '14';
      await analyticsController.getLessonCompletionTrends(req, res, next);
      expect(mockAnalyticsService.getAnalyticsForPeriod).toHaveBeenCalledWith(14);
    });

    it('forwards errors to next and logs lesson completion trends failure', async () => {
      await expectErrorPath(
        analyticsController.getLessonCompletionTrends.bind(analyticsController),
        mockAnalyticsService.getAnalyticsForPeriod,
        'Error fetching lesson completion trends:',
      );
    });
  });
});
