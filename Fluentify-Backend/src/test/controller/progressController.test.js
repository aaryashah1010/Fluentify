import { jest } from '@jest/globals';

const mockCourseRepo = {
  findCourseById: jest.fn(),
  findCourseDataById: jest.fn(),
  findLessonDbId: jest.fn(),
  findAllActiveCourses: jest.fn(),
};

const mockProgressRepo = {
  findUnitProgress: jest.fn(),
  findLessonProgress: jest.fn(),
  findUserStats: jest.fn(),
  findSpecificLessonProgress: jest.fn(),
  upsertLessonProgress: jest.fn(),
  createExerciseAttempt: jest.fn(),
  countCompletedLessonsInUnit: jest.fn(),
  markUnitComplete: jest.fn(),
  unlockUnit: jest.fn(),
  createUserStats: jest.fn(),
  updateUserStreak: jest.fn(),
  initializeCourseProgress: jest.fn(),
  getSummaryKPIs: jest.fn(),
  getProgressOverTime: jest.fn(),
  getRecentActivity: jest.fn(),
};

const trackLessonCompletion = jest.fn();

await jest.unstable_mockModule('../../repositories/courseRepository.js', () => ({ default: mockCourseRepo }));
await jest.unstable_mockModule('../../repositories/progressRepository.js', () => ({ default: mockProgressRepo }));
await jest.unstable_mockModule('../../services/analyticsService.js', () => ({ default: { trackLessonCompletion } }));

const responseUtils = await import('../../utils/response.js');
const { successResponse, listResponse } = responseUtils;

const progressController = await import('../../controllers/progressController.js');
const {
  getCourseProgress,
  markLessonComplete,
  getUserCourses,
  initializeCourseProgress,
  getProgressReport,
} = progressController;

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}

function createNext() { return jest.fn(); }

describe('progressController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourseProgress', () => {
    it('throws COURSE_NOT_FOUND when course missing', async () => {
      mockCourseRepo.findCourseById.mockResolvedValueOnce(null);
      const req = { user: { id: 1 }, params: { courseId: '1' } };
      const res = createRes();
      const next = createNext();
      await getCourseProgress(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns progress with default stats when none', async () => {
      mockCourseRepo.findCourseById.mockResolvedValueOnce({ course_data: { a: 1 } });
      mockProgressRepo.findUnitProgress.mockResolvedValueOnce([{ unit_id: 1 }]);
      mockProgressRepo.findLessonProgress.mockResolvedValueOnce([{ lesson_id: 1 }]);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);
      const req = { user: { id: 1 }, params: { courseId: '1' } };
      const res = createRes();
      const next = createNext();

      await getCourseProgress(req, res, next);
      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data.unitProgress).toHaveLength(1);
      expect(payload.data.stats.total_xp).toBe(0);
      expect(next).not.toHaveBeenCalled();
    });

    it('falls back to empty course_data and uses existing stats', async () => {
      const stats = {
        total_xp: 10,
        lessons_completed: 2,
        units_completed: 1,
        current_streak: 3,
        longest_streak: 4,
      };

      mockCourseRepo.findCourseById.mockResolvedValueOnce({ course_data: null });
      mockProgressRepo.findUnitProgress.mockResolvedValueOnce([]);
      mockProgressRepo.findLessonProgress.mockResolvedValueOnce([]);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(stats);

      const req = { user: { id: 1 }, params: { courseId: '1' } };
      const res = createRes();
      const next = createNext();

      await getCourseProgress(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data.course).toEqual({});
      expect(payload.data.stats).toEqual(stats);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('markLessonComplete', () => {
    const baseCourseData = {
      course: {
        units: [
          {
            id: 1,
            lessons: [
              { id: 1, xpReward: 50, vocabulary: [{}, {}, {}] },
              { id: 2, xpReward: 50, vocabulary: [] },
            ],
          },
          {
            id: 2,
            lessons: [],
          },
        ],
      },
      metadata: { createdBy: 'ai', language: 'English' },
    };

    it('returns 400 when not enough correct answers', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData });
      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 60, exercises: [
          { isCorrect: false }, { isCorrect: false }, { isCorrect: true },
          { isCorrect: false }, { isCorrect: false },
        ] },
      };
      const res = createRes();
      const next = createNext();
      await markLessonComplete(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('throws COURSE_NOT_FOUND when course data missing', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      const req = { user: { id: 1 }, params: { courseId: '1', unitId: '1', lessonId: '1' }, body: {} };
      const res = createRes();
      const next = createNext();
      await markLessonComplete(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('throws LESSON_NOT_FOUND when lessonDbId missing', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(null);
      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 100, exercises: [] },
      };
      const res = createRes();
      const next = createNext();
      await markLessonComplete(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('throws LESSON_NOT_FOUND when lesson missing', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [] } } });
      const req = { user: { id: 1 }, params: { courseId: '1', unitId: '1', lessonId: '1' }, body: {} };
      const res = createRes();
      const next = createNext();
      await markLessonComplete(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('throws LESSON_ALREADY_COMPLETED when progress exists and completed', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce({ is_completed: true });
      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 100, exercises: [] },
      };
      const res = createRes();
      const next = createNext();
      await markLessonComplete(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('completes lesson, tracks analytics, updates stats and returns success', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(2); // equal to lessons length
      mockProgressRepo.findUserStats
        .mockResolvedValueOnce(null) // for createUserStats path
        .mockResolvedValueOnce({ current_streak: 1, last_activity_date: null });

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 100, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);
      expect(mockProgressRepo.upsertLessonProgress).toHaveBeenCalled();
      expect(trackLessonCompletion).toHaveBeenCalled();
      expect(mockProgressRepo.createExerciseAttempt).not.toHaveBeenCalled();
      expect(mockProgressRepo.markUnitComplete).toHaveBeenCalled();
      expect(mockProgressRepo.unlockUnit).toHaveBeenCalled();
      expect(mockProgressRepo.createUserStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('handles analytics failure, saves exercises and updates streak (yesterday)', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      mockProgressRepo.findUserStats.mockResolvedValueOnce({
        current_streak: 2,
        last_activity_date: yesterday.toISOString(),
      });

      trackLessonCompletion.mockRejectedValueOnce(new Error('analytics fail'));

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: {
          score: 80,
          exercises: [
            { isCorrect: true, userAnswer: 'a' },
            { isCorrect: false, userAnswer: 'b' },
          ],
        },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);
      expect(trackLessonCompletion).toHaveBeenCalled();
      expect(mockProgressRepo.createExerciseAttempt).toHaveBeenCalledTimes(2);
      expect(mockProgressRepo.updateUserStreak).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('resets streak when last activity is older than yesterday', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);

      const now = new Date();
      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(now.getDate() - 3);

      mockProgressRepo.findUserStats.mockResolvedValueOnce({
        current_streak: 5,
        last_activity_date: threeDaysAgo.toISOString(),
      });

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 100, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      expect(mockProgressRepo.updateUserStreak).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('completes lesson when enough correct answers (no 400)', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: {
          score: 80,
          exercises: [
            { isCorrect: true },
            { isCorrect: true },
            { isCorrect: true },
            { isCorrect: false },
            { isCorrect: false },
          ],
        },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(mockProgressRepo.upsertLessonProgress).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('keeps streak when activity already today', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);

      const todayIso = new Date().toISOString();
      mockProgressRepo.findUserStats.mockResolvedValueOnce({
        current_streak: 3,
        last_activity_date: todayIso,
      });

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 90, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('completes last admin unit without unlocking next unit', async () => {
      const adminCourseData = {
        course: {
          units: [
            {
              id: 1,
              lessons: [
                { id: 1, xpReward: 50, vocabulary: [] },
              ],
            },
          ],
        },
        metadata: { createdBy: 'admin', language: 'Spanish' },
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: adminCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(20);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(1); // all lessons in last unit completed
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 100, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      expect(mockProgressRepo.markUnitComplete).toHaveBeenCalledWith(1, '1', 1);
      expect(mockProgressRepo.unlockUnit).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('uses default body values, xpReward fallback and language from course.language', async () => {
      const langCourseData = {
        course: {
          language: 'French',
          units: [
            {
              id: 1,
              lessons: [
                { id: 1, vocabulary: [] },
              ],
            },
          ],
        },
        metadata: {},
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: langCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(30);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        // no body -> triggers default destructuring { score = 100, exercises = [] }
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      // xpReward fallback to 50 when not set on lesson
      expect(mockProgressRepo.upsertLessonProgress).toHaveBeenCalledWith(
        1,
        '1',
        1,
        30,
        100,
        50,
        0,
        0,
      );

      // language should come from course.language
      expect(trackLessonCompletion).toHaveBeenCalledWith(
        1,
        'French',
        'AI',
        null,
        expect.objectContaining({ lessonId: 1 }),
      );

      // stats created with default streak tracking
      expect(mockProgressRepo.createUserStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getUserCourses', () => {
    it('maps courses and returns listResponse', async () => {
      mockCourseRepo.findAllActiveCourses.mockResolvedValueOnce([
        {
          id: 1,
          language: 'en',
          title: 'T',
          description: 'D',
          source_type: 'ai',
          total_lessons: 10,
          total_units: 2,
          created_at: 'now',
          total_xp: 5,
          lessons_completed: 2,
          units_completed: 1,
          current_streak: 3,
        },
      ]);
      const req = { user: { id: 1 } };
      const res = createRes();
      const next = createNext();
      await getUserCourses(req, res, next);
      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data[0].progress.lessonsCompleted).toBe(2);
    });

    it('fills missing progress fields with zeros', async () => {
      mockCourseRepo.findAllActiveCourses.mockResolvedValueOnce([
        {
          id: 1,
          language: 'en',
          title: 'NoProgress',
          description: 'D',
          source_type: 'ai',
          total_lessons: 0,
          total_units: 0,
          created_at: 'now',
          total_xp: null,
          lessons_completed: undefined,
          units_completed: null,
          current_streak: undefined,
        },
      ]);

      const req = { user: { id: 1 } };
      const res = createRes();
      const next = createNext();

      await getUserCourses(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const course = res.body.data[0];
      expect(course.progress.totalXp).toBe(0);
      expect(course.progress.lessonsCompleted).toBe(0);
      expect(course.progress.unitsCompleted).toBe(0);
      expect(course.progress.currentStreak).toBe(0);
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors via next when repository fails', async () => {
      mockCourseRepo.findAllActiveCourses.mockRejectedValueOnce(new Error('db'));
      const req = { user: { id: 1 } };
      const res = createRes();
      const next = createNext();
      await getUserCourses(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('initializeCourseProgress', () => {
    it('calls repository and swallows error by rethrowing', async () => {
      mockProgressRepo.initializeCourseProgress.mockResolvedValueOnce();
      await initializeCourseProgress(1, 2);
      expect(mockProgressRepo.initializeCourseProgress).toHaveBeenCalledWith(1, 2);

      const err = new Error('fail');
      mockProgressRepo.initializeCourseProgress.mockRejectedValueOnce(err);
      await expect(initializeCourseProgress(1, 2)).rejects.toBe(err);
    });
  });

  describe('getProgressReport', () => {
    it('converts range and returns successResponse', async () => {
      mockProgressRepo.getSummaryKPIs.mockResolvedValueOnce({ total_xp: 1 });
      mockProgressRepo.getProgressOverTime.mockResolvedValueOnce([]);
      mockProgressRepo.getRecentActivity.mockResolvedValueOnce([]);
      const req = { user: { id: 1 }, query: { range: '7d', courseId: '3' } };
      const res = createRes();
      const next = createNext();
      await getProgressReport(req, res, next);
      expect(mockProgressRepo.getSummaryKPIs).toHaveBeenCalledWith(1, 7, '3');
      expect(res.json).toHaveBeenCalled();
    });

    it('handles all range and forwards errors', async () => {
      const err = new Error('db');
      mockProgressRepo.getSummaryKPIs.mockRejectedValueOnce(err);
      const req = { user: { id: 1 }, query: { range: 'all' } };
      const res = createRes();
      const next = createNext();
      await getProgressReport(req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });

    it('uses default all range when not provided and succeeds', async () => {
      mockProgressRepo.getSummaryKPIs.mockResolvedValueOnce({ total_xp: 0 });
      mockProgressRepo.getProgressOverTime.mockResolvedValueOnce([]);
      mockProgressRepo.getRecentActivity.mockResolvedValueOnce([]);

      const req = { user: { id: 1 }, query: {} };
      const res = createRes();
      const next = createNext();

      await getProgressReport(req, res, next);

      // range defaults to 'all' -> days = null, courseId undefined
      expect(mockProgressRepo.getSummaryKPIs).toHaveBeenCalledWith(1, null, undefined);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
