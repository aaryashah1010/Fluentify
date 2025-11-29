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
const { ERRORS } = await import('../../utils/error.js');

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
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await getCourseProgress(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.COURSE_NOT_FOUND);
      expect(errorSpy).toHaveBeenCalledWith('Error fetching course progress:', ERRORS.COURSE_NOT_FOUND);
      errorSpy.mockRestore();
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
      expect(payload.message).toBe('Course progress retrieved successfully');
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
      expect(payload.message).toBe('Course progress retrieved successfully');
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
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You need at least 3 out of 5 correct answers to complete this lesson',
        data: {
          correctAnswers: 1,
          totalExercises: 5,
          passed: false,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('throws COURSE_NOT_FOUND when course data missing', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      const req = { user: { id: 1 }, params: { courseId: '1', unitId: '1', lessonId: '1' }, body: {} };
      const res = createRes();
      const next = createNext();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await markLessonComplete(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.COURSE_NOT_FOUND);
      expect(errorSpy).toHaveBeenCalledWith('Error marking lesson complete:', ERRORS.COURSE_NOT_FOUND);
      errorSpy.mockRestore();
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

    it('throws LESSON_NOT_FOUND when lesson missing (unit not found) without crashing on undefined access', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [] } } });
      const req = { user: { id: 1 }, params: { courseId: '1', unitId: '1', lessonId: '1' }, body: {} };
      const res = createRes();
      const next = createNext();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await markLessonComplete(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.LESSON_NOT_FOUND);
      expect(mockCourseRepo.findLessonDbId).not.toHaveBeenCalled();
      expect(mockProgressRepo.upsertLessonProgress).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith('Error marking lesson complete:', ERRORS.LESSON_NOT_FOUND);
      errorSpy.mockRestore();
    });

    it('skips exercise validation when exercises is null and still forwards lessonDbId errors', async () => {
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(null);
      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 80, exercises: null },
      };
      const res = createRes();
      const next = createNext();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await markLessonComplete(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.LESSON_NOT_FOUND);
      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(errorSpy).toHaveBeenCalledWith('Error marking lesson complete:', ERRORS.LESSON_NOT_FOUND);
      errorSpy.mockRestore();
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

      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await markLessonComplete(req, res, next);

      expect(mockProgressRepo.upsertLessonProgress).toHaveBeenCalled();
      expect(trackLessonCompletion).toHaveBeenCalled();
      expect(mockProgressRepo.createExerciseAttempt).not.toHaveBeenCalled();
      expect(mockProgressRepo.markUnitComplete).toHaveBeenCalled();
      expect(mockProgressRepo.unlockUnit).toHaveBeenCalled();
      expect(mockProgressRepo.createUserStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();

      const payload = res.body;
      // ensure returned data still contains xpEarned and unitCompleted (guards against mutants that blank the object)
      expect(payload.data).toHaveProperty('xpEarned');
      expect(payload.data).toHaveProperty('unitCompleted');
      expect(payload.data.unitCompleted).toBe(true);
      expect(payload.message).toBe('Unit completed! Next unit unlocked!');

      expect(logSpy).toHaveBeenCalledWith(
        '🔍 Analytics Debug - Tracking lesson completion:',
        expect.objectContaining({ userId: 1, courseId: 1, lessonId: 1 }),
      );
      expect(logSpy).toHaveBeenCalledWith('✅ Analytics - Lesson completion tracked successfully');
      logSpy.mockRestore();
    });

    it('handles analytics failure, saves exercises and updates streak (yesterday) and formats today date', async () => {
      jest.useFakeTimers();
      const fixedNow = new Date('2025-04-10T10:00:00.000Z');
      jest.setSystemTime(fixedNow);
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);

      const yesterday = new Date(fixedNow);
      yesterday.setDate(fixedNow.getDate() - 1);

      mockProgressRepo.findUserStats.mockReset();
      mockProgressRepo.findUserStats.mockResolvedValueOnce({
        current_streak: 2,
        last_activity_date: yesterday.toISOString(),
      });

      const analyticsError = new Error('analytics fail');
      trackLessonCompletion.mockRejectedValueOnce(analyticsError);

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

      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await markLessonComplete(req, res, next);

      expect(trackLessonCompletion).toHaveBeenCalled();
      expect(mockProgressRepo.createExerciseAttempt).toHaveBeenCalledTimes(2);

      const streakCall = mockProgressRepo.updateUserStreak.mock.calls.find((call) => call[0] === 1);
      expect(streakCall).toBeDefined();
      expect(streakCall[1]).toBe('1');
      expect(streakCall[2]).toBe(3);
      expect(streakCall[3]).toBe('2025-04-10');

      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();

      expect(errSpy).toHaveBeenCalledWith('❌ Error tracking lesson completion analytics:', analyticsError);
      errSpy.mockRestore();
      jest.useRealTimers();
    });

    it('resets streak when last activity is older than yesterday (exact reset to 1)', async () => {
      jest.useFakeTimers();
      const fixedNow = new Date('2025-04-10T10:00:00.000Z');
      jest.setSystemTime(fixedNow);
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);

      const threeDaysAgo = new Date(fixedNow);
      threeDaysAgo.setDate(fixedNow.getDate() - 3);

      mockProgressRepo.findUserStats.mockReset();
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

      // if last activity older than yesterday, streak resets to 1
      const streakCall = mockProgressRepo.updateUserStreak.mock.calls.find((call) => call[0] === 1);
      expect(streakCall[2]).toBe(1);
      expect(streakCall[3]).toBe('2025-04-10');
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      jest.useRealTimers();
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
      const payload = res.body;
      expect(payload.message).toBe('Lesson completed!');
      expect(next).not.toHaveBeenCalled();
    });

    it('keeps streak when activity already today (no streak increment)', async () => {
      jest.useFakeTimers();
      const fixedNow = new Date('2025-04-10T10:00:00.000Z');
      jest.setSystemTime(fixedNow);
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(10);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);

      const todayIso = fixedNow.toISOString();
      mockProgressRepo.findUserStats.mockReset();
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
      const streakCall = mockProgressRepo.updateUserStreak.mock.calls.find((call) => call[0] === 1);
      expect(streakCall[2]).toBe(3);
      expect(streakCall[3]).toBe('2025-04-10');
      jest.useRealTimers();
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
      const payload = res.body;
      expect(payload.message).toBe('Unit completed! Next unit unlocked!');

      // moduleType should be ADMIN and language from metadata
      expect(trackLessonCompletion).toHaveBeenCalledWith(
        1,
        'Spanish',
        'ADMIN',
        null,
        expect.objectContaining({ lessonId: 1 }),
      );
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
        expect.objectContaining({ lessonId: 1, exercisesCompleted: 0 }),
      );

      // stats created with default streak tracking
      expect(mockProgressRepo.createUserStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('computes vocabularyMastered based on score', async () => {
      const vocabCourseData = {
        course: {
          units: [
            {
              id: 1,
              lessons: [
                { id: 1, xpReward: 50, vocabulary: [{}, {}, {}, {}] },
              ],
            },
          ],
        },
        metadata: { createdBy: 'ai' },
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: vocabCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(40);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 50, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      // vocabularyCount = 4, score = 50 => Math.round(4 * 0.5) = 2
      expect(mockProgressRepo.upsertLessonProgress).toHaveBeenCalledWith(
        1,
        '1',
        1,
        40,
        50,
        50,
        2,
        4,
      );
      expect(next).not.toHaveBeenCalled();
    });

    // NEW: detect mutant that always picks first unit by verifying a lesson inside unit 2 gets correctly selected
    it('selects the correct unit by id (unitId=2) and completes a lesson there', async () => {
      const courseData = {
        course: {
          units: [
            { id: 1, lessons: [] }, // empty first unit
            { id: 2, lessons: [{ id: 5, xpReward: 40, vocabulary: [] }] }, // target unit
          ],
        },
        metadata: { createdBy: 'ai', language: 'English' },
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      const req = {
        user: { id: 7 },
        params: { courseId: '1', unitId: '2', lessonId: '5' },
        body: { score: 100, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      // If mutation made unit selection "find(u => true)" the first unit (id 1) would be selected and the test would fail.
      expect(mockProgressRepo.upsertLessonProgress).toHaveBeenCalledWith(
        7, '1', 2, 55, 100, 40, 0, 0,
      );
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    // NEW: ensure lesson.vocabulary undefined is handled (vocabularyCount fallback to 0)
    it('handles lesson with undefined vocabulary (treats as zero)', async () => {
      const courseData = {
        course: {
          units: [
            {
              id: 1,
              lessons: [
                { id: 1, xpReward: 50 /* no vocabulary prop */ },
              ],
            },
          ],
        },
        metadata: { createdBy: 'ai' },
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(99);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 30, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      // vocabularyCount should be treated as 0 and upsert called accordingly
      expect(mockProgressRepo.upsertLessonProgress).toHaveBeenCalledWith(
        1, '1', 1, 99, 30, 50, 0, 0,
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('defaults moduleType to AI and language to null when metadata is missing entirely', async () => {
      const courseData = {
        course: {
          units: [
            {
              id: 1,
              lessons: [
                { id: 1, xpReward: 60, vocabulary: [] },
              ],
            },
          ],
        },
        // metadata intentionally omitted to exercise optional chaining guards
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(70);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      const req = { user: { id: 1 }, params: { courseId: '1', unitId: '1', lessonId: '1' }, body: { score: 95, exercises: [] } };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      expect(trackLessonCompletion).toHaveBeenCalledWith(
        1,
        null,
        'AI',
        null,
        expect.objectContaining({ lessonId: 1, courseId: 1 }),
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('increments streak and formats ISO dates correctly when last activity was yesterday', async () => {
      jest.useFakeTimers();
      const fixedNow = new Date('2025-04-12T08:00:00.000Z');
      jest.setSystemTime(fixedNow);

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: baseCourseData, language: 'English' });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(88);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);

      const yesterdayIso = new Date('2025-04-11T09:00:00.000Z').toISOString();
      mockProgressRepo.findUserStats.mockReset();
      mockProgressRepo.findUserStats.mockResolvedValueOnce({
        current_streak: 4,
        last_activity_date: yesterdayIso,
      });

      const req = {
        user: { id: 1 },
        params: { courseId: '1', unitId: '1', lessonId: '1' },
        body: { score: 100, exercises: [] },
      };
      const res = createRes();
      const next = createNext();

      await markLessonComplete(req, res, next);

      const streakCall = mockProgressRepo.updateUserStreak.mock.calls.find((call) => call[0] === 1);
      expect(streakCall[2]).toBe(5);
      expect(streakCall[3]).toBe('2025-04-12');
      jest.useRealTimers();
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
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      await getUserCourses(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data[0].progress.lessonsCompleted).toBe(2);
      expect(payload.message).toBe('User courses retrieved successfully');

      expect(logSpy).toHaveBeenCalledWith('👤 getUserCourses called for userId:', 1);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('📦 Returning 1 courses to user 1'));
      logSpy.mockRestore();
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
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await getUserCourses(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(errSpy).toHaveBeenCalledWith('Error fetching user courses:', expect.any(Error));
      errSpy.mockRestore();
    });
  });

  describe('initializeCourseProgress', () => {
    it('calls repository and swallows error by rethrowing', async () => {
      mockProgressRepo.initializeCourseProgress.mockResolvedValueOnce();
      await initializeCourseProgress(1, 2);
      expect(mockProgressRepo.initializeCourseProgress).toHaveBeenCalledWith(1, 2);

      const err = new Error('fail');
      mockProgressRepo.initializeCourseProgress.mockRejectedValueOnce(err);
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      await expect(initializeCourseProgress(1, 2)).rejects.toBe(err);
      expect(errSpy).toHaveBeenCalledWith('Error initializing course progress:', err);
      errSpy.mockRestore();
    });
  });

  describe('getProgressReport', () => {
    it('converts range and returns successResponse', async () => {
      mockProgressRepo.getSummaryKPIs.mockResolvedValueOnce({ total_xp: 1 });
      mockProgressRepo.getProgressOverTime.mockResolvedValueOnce([{ t: 1 }]);
      mockProgressRepo.getRecentActivity.mockResolvedValueOnce([{ a: 1 }]);
      const req = { user: { id: 1 }, query: { range: '7d', courseId: '3' } };
      const res = createRes();
      const next = createNext();
      await getProgressReport(req, res, next);
      expect(mockProgressRepo.getSummaryKPIs).toHaveBeenCalledWith(1, 7, '3');
      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.message).toBe('Progress report retrieved successfully');

      // ensure the response still contains the expected nested data (guards against mutants returning {})
      expect(payload.data).toHaveProperty('summary');
      expect(payload.data.summary.total_xp).toBe(1);
      expect(Array.isArray(payload.data.timeline)).toBe(true);
      expect(Array.isArray(payload.data.recentActivity)).toBe(true);
      expect(next).not.toHaveBeenCalled();
    });

    it('handles all range and forwards errors', async () => {
      const err = new Error('db');
      mockProgressRepo.getSummaryKPIs.mockRejectedValueOnce(err);
      const req = { user: { id: 1 }, query: { range: 'all' } };
      const res = createRes();
      const next = createNext();
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await getProgressReport(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(errSpy).toHaveBeenCalledWith('Error fetching progress report:', err);
      errSpy.mockRestore();
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
      const payload = res.body;
      expect(payload.message).toBe('Progress report retrieved successfully');
      expect(next).not.toHaveBeenCalled();
    });

    it('parses range using the d suffix (mutation-safe)', async () => {
      mockProgressRepo.getSummaryKPIs.mockResolvedValueOnce({ total_xp: 2 });
      mockProgressRepo.getProgressOverTime.mockResolvedValueOnce([]);
      mockProgressRepo.getRecentActivity.mockResolvedValueOnce([]);

      const req = { user: { id: 1 }, query: { range: 'd7' } };
      const res = createRes();
      const next = createNext();

      await getProgressReport(req, res, next);

      // "d7" should still become 7 days when replacing the first 'd'
      expect(mockProgressRepo.getSummaryKPIs).toHaveBeenCalledWith(1, 7, undefined);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
