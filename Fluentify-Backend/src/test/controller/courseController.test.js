import { jest } from '@jest/globals';

// Mock response helpers
const mockSuccess = jest.fn((data, message) => ({ success: true, data, message }));
const mockCreated = jest.fn((data, message) => ({ success: true, data, message }));
const mockList = jest.fn((data, message) => ({ success: true, data, message }));
await jest.unstable_mockModule('../../utils/response.js', () => ({
  successResponse: mockSuccess,
  createdResponse: mockCreated,
  listResponse: mockList,
}));

// Mocks
const mockGemini = {
  generateCourseOutline: jest.fn(),
  generateUnit: jest.fn(),
  generateCourse: jest.fn(),
  generateExercises: jest.fn(),
};
await jest.unstable_mockModule('../../services/geminiService.js', () => ({ default: mockGemini }));

const mockCourseRepo = {
  createCourse: jest.fn(),
  updateCourseData: jest.fn(),
  populateCourseStructure: jest.fn(),
  findLearnerCoursesWithStats: jest.fn(),
  findCourseById: jest.fn(),
  findCourseDataById: jest.fn(),
  findLessonDbId: jest.fn(),
  updateLessonExercises: jest.fn(),
  deleteCourse: jest.fn(),
  getPublishedLanguages: jest.fn(),
  getPublishedCoursesByLanguage: jest.fn(),
  getPublishedCourseDetails: jest.fn(),
};
await jest.unstable_mockModule('../../repositories/courseRepository.js', () => ({ default: mockCourseRepo }));

const mockProgressRepo = {
  initializeCourseProgress: jest.fn(),
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
};
await jest.unstable_mockModule('../../repositories/progressRepository.js', () => ({ default: mockProgressRepo }));

const mockAnalytics = {
  trackAIGeneration: jest.fn(),
};
await jest.unstable_mockModule('../../services/analyticsService.js', () => ({ default: mockAnalytics }));

const controller = (await import('../../controllers/courseController.js')).default;

function resSSEMock(){
  const res = {
    headers: {},
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
  };
  return res;
}
function resMock(){
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}
const nextMock = () => jest.fn();

const outlineOneUnit = {
  units: [ { title: 'Unit 1', id: 1, lessons: [ { id: 1, title: 'L1', type: 'vocabulary', estimatedTime: 10, xpReward: 50 } ] } ]
};
const unitGenerated = {
  id: 1, title: 'Unit 1', estimatedTime: 10, lessons: [ { id: 1, title: 'L1', type: 'vocabulary', xpReward: 50 } ]
};

describe('courseController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCourseStream', () => {
    it('streams successful generation events', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w', expertise: 'Beginner' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockResolvedValueOnce(outlineOneUnit);
      mockGemini.generateUnit.mockResolvedValueOnce(unitGenerated);
      mockCourseRepo.createCourse.mockResolvedValueOnce(99);

      await controller.generateCourseStream(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
    });

    it('handles error path and writes error event', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockRejectedValueOnce(new Error('429 Too Many Requests'));

      await controller.generateCourseStream(req, res, next);
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
    });

    it('success path but analytics tracking fails (covered)', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w', expertise: 'Beginner' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockResolvedValueOnce(outlineOneUnit);
      mockGemini.generateUnit.mockResolvedValueOnce(unitGenerated);
      mockCourseRepo.createCourse.mockResolvedValueOnce(99);
      mockAnalytics.trackAIGeneration.mockRejectedValueOnce(new Error('analytics fail'));
      await controller.generateCourseStream(req, res, next);
      expect(res.end).toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when language or duration missing', async () => {
      const req = { query: { expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      await controller.generateCourseStream(req, res, next);
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
    });
    

    it('handles multi-unit outline and delay branch', async () => {
      const outlineTwoUnits = {
        units: [
          { title: 'Unit 1', id: 1, lessons: [ { id: 1, title: 'L1', type: 'vocabulary', estimatedTime: 10, xpReward: 50 } ] },
          { title: 'Unit 2', id: 2, lessons: [ { id: 2, title: 'L2', type: 'vocabulary', estimatedTime: 10, xpReward: 50 } ] },
        ],
      };

      const req = { query: { language: 'English', expectedDuration: '4w', expertise: 'Beginner' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      const timeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((cb) => { cb(); return 0; });

      mockGemini.generateCourseOutline.mockResolvedValueOnce(outlineTwoUnits);
      mockGemini.generateUnit
        .mockResolvedValueOnce(unitGenerated)
        .mockResolvedValueOnce(unitGenerated);
      mockCourseRepo.createCourse.mockResolvedValueOnce(100);

      await controller.generateCourseStream(req, res, next);
      expect(timeoutSpy).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
      timeoutSpy.mockRestore();
    });

    it('error path where analytics tracking of failure also fails', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockRejectedValueOnce(new Error('rate limited'));
      mockAnalytics.trackAIGeneration.mockRejectedValueOnce(new Error('analytics fail'));
      await controller.generateCourseStream(req, res, next);
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('generateCourse (legacy)', () => {
    it('valid success', async () => {
      const req = { body: { language: 'English', expectedDuration: '4w', expertise: 'Intermediate' }, user: { id: 2 } };
      const res = resMock(); const next = nextMock();
      const courseData = { course: { title: 'T' }, metadata: { totalUnits: 1, totalLessons: 1, estimatedTotalTime: 10 } };
      mockGemini.generateCourse.mockResolvedValueOnce(courseData);
      mockCourseRepo.createCourse.mockResolvedValueOnce(101);

      await controller.generateCourse(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('missing both language and expectedDuration throws', async () => {
      const req = { body: { }, user: { id: 2 } }; const res = resMock(); const next = nextMock();
      await controller.generateCourse(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('missing language throws', async () => {
      const req = { body: { expectedDuration: '4w' }, user: { id: 2 } }; const res = resMock(); const next = nextMock();
      await controller.generateCourse(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('missing expectedDuration throws', async () => {
      const req = { body: { language: 'English' }, user: { id: 2 } }; const res = resMock(); const next = nextMock();
      await controller.generateCourse(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getLearnerCourses', () => {
    it('returns list', async () => {
      const req = { user: { id: 3 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findLearnerCoursesWithStats.mockResolvedValueOnce([
        { id: 1, language: 'English', title: 'T', description: 'D', expected_duration: '4w', total_units: 1, total_lessons: 2, estimated_total_time: 10, created_at: 'now', total_xp: 0, lessons_completed: 0, units_completed: 0, current_streak: 0, progress_percentage: 0 }
      ]);
      await controller.getLearnerCourses(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('error path calls next()', async () => {
      const req = { user: { id: 3 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findLearnerCoursesWithStats.mockRejectedValueOnce(new Error('fail'));
      await controller.getLearnerCourses(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getCourseDetails', () => {
    it('success with progress maps', async () => {
      const req = { params: { courseId: 1 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      const courseData = { course: { title: 'T', duration: '4w', units: [ { id: 1, lessons: [ { id: 1 }, { id: 2 } ] } ] } };
      mockCourseRepo.findCourseById.mockResolvedValueOnce({ id: 1, language: 'English', course_data: courseData });
      mockProgressRepo.findUnitProgress.mockResolvedValueOnce([ { unit_id: 1, is_unlocked: true, is_completed: false } ]);
      mockProgressRepo.findLessonProgress.mockResolvedValueOnce([ { unit_id: 1, lesson_id: 1, is_completed: true, score: 80, xp_earned: 50 } ]);
      mockProgressRepo.findUserStats.mockResolvedValueOnce({});
      await controller.getCourseDetails(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('uses default stats when none found', async () => {
      const req = { params: { courseId: 1 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      const courseData = { course: { title: 'T', duration: '4w', units: [ { id: 1, lessons: [ { id: 1 } ] } ] } };

      mockCourseRepo.findCourseById.mockResolvedValueOnce({ id: 1, language: 'English', course_data: courseData });
      mockProgressRepo.findUnitProgress.mockResolvedValueOnce([]);
      mockProgressRepo.findLessonProgress.mockResolvedValueOnce([]);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      await controller.getCourseDetails(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data.stats.total_xp).toBe(0);
      expect(payload.data.stats.lessons_completed).toBe(0);
    });

    it('throws on course not found', async () => {
      const req = { params: { courseId: 1 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseById.mockResolvedValueOnce(null);
      await controller.getCourseDetails(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('parsing course_data throws -> INVALID_COURSE_DATA', async () => {
      const req = { params: { courseId: 1 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      const course = {};
      Object.defineProperty(course, 'course_data', { get() { throw new Error('parse'); } });
      mockCourseRepo.findCourseById.mockResolvedValueOnce(course);
      await controller.getCourseDetails(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getLessonDetails', () => {
    it('course not found throws', async () => {
      const req = { params: { courseId: 1, unitId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      await controller.getLessonDetails(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('lesson not found throws', async () => {
      const req = { params: { courseId: 1, unitId: 1, lessonId: 9 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [] } ] } } });
      await controller.getLessonDetails(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('success', async () => {
      const req = { params: { courseId: 1, unitId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce({ is_completed: true });
      await controller.getLessonDetails(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('success with null progress uses progress || null', async () => {
      const req = { params: { courseId: 1, unitId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);

      await controller.getLessonDetails(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data.progress).toBeNull();
    });
  });

  describe('getLessonDetailsLegacy', () => {
    it('course not found throws', async () => {
      const req = { params: { courseId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      await controller.getLessonDetailsLegacy(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('lesson not found throws', async () => {
      const req = { params: { courseId: 1, lessonId: 9 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      await controller.getLessonDetailsLegacy(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('success', async () => {
      const req = { params: { courseId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce({});
      await controller.getLessonDetailsLegacy(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('success with null progress uses progress || null', async () => {
      const req = { params: { courseId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);

      await controller.getLessonDetailsLegacy(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data.progress).toBeNull();
    });
  });

  describe('completeLessonLegacy', () => {
    const baseReq = { params: { courseId: 1, lessonId: 1 }, user: { id: 6 }, body: { score: 100, exercises: [] } };
    const courseData = { course: { units: [ { id: 1, lessons: [ { id: 1, xpReward: 50 } ] } ] } };

    it('course not found throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      await controller.completeLessonLegacy(baseReq, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('lesson not found throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [] } ] } } });
      await controller.completeLessonLegacy(baseReq, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('exercises failing rule returns 400', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      const req = { ...baseReq, body: { exercises: [ { isCorrect: false }, { isCorrect: false }, { isCorrect: false }, { isCorrect: false }, { isCorrect: false } ] } };
      await controller.completeLessonLegacy(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('lessonDbId not found throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(null);
      await controller.completeLessonLegacy(baseReq, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('existing progress completed throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce({ is_completed: true });
      await controller.completeLessonLegacy(baseReq, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('success path (unit not completed)', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);
      await controller.completeLessonLegacy(baseReq, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('unit completed branch', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(1);
      mockProgressRepo.findUserStats.mockResolvedValueOnce({ current_streak: 0, last_activity_date: null });
      await controller.completeLessonLegacy(baseReq, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('streak update branch: yesterday -> increment', async () => {
      const res = resMock(); const next = nextMock();
      const now = new Date();
      const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1, xpReward: 50 } ] } ] } } });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce({ current_streak: 2, last_activity_date: yesterday.toISOString() });
      await controller.completeLessonLegacy(baseReq, res, next);
      expect(mockProgressRepo.updateUserStreak).toHaveBeenCalled();
    });

    it('creates exercise attempts when exercises pass rule', async () => {
      const res = resMock(); const next = nextMock();
      const req = {
        ...baseReq,
        body: {
          score: 80,
          exercises: [
            { isCorrect: true, userAnswer: 'a' },
            { isCorrect: true, userAnswer: 'b' },
            { isCorrect: true, userAnswer: 'c' },
            { isCorrect: false, userAnswer: 'd' },
            { isCorrect: false, userAnswer: 'e' },
          ],
        },
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      await controller.completeLessonLegacy(req, res, next);

      expect(mockProgressRepo.createExerciseAttempt).toHaveBeenCalledTimes(5);
      expect(res.json).toHaveBeenCalled();
    });

    it('unit completed and next unit exists -> unlocks next unit', async () => {
      const res = resMock(); const next = nextMock();
      const multiUnitCourseData = {
        course: {
          units: [
            { id: 1, lessons: [ { id: 1, xpReward: 50 } ] },
            { id: 2, lessons: [] },
          ],
        },
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: multiUnitCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      // completedLessons >= totalLessonsInUnit
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(1);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      await controller.completeLessonLegacy(baseReq, res, next);

      expect(mockProgressRepo.markUnitComplete).toHaveBeenCalledWith(6, 1, 1);
      expect(mockProgressRepo.unlockUnit).toHaveBeenCalledWith(6, 1, 2);
      expect(res.json).toHaveBeenCalled();
    });

    it('streak branch: last activity today keeps current streak', async () => {
      const res = resMock(); const next = nextMock();
      const todayIso = new Date().toISOString();

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce({ current_streak: 3, last_activity_date: todayIso });

      await controller.completeLessonLegacy(baseReq, res, next);

      expect(mockProgressRepo.updateUserStreak).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('generateLessonExercises', () => {
    const baseParams = { courseId: 1, unitId: 1, lessonId: 1 };
    it('course not found throws', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      await controller.generateLessonExercises(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('lesson not found throws', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [] } ] } } });
      await controller.generateLessonExercises(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('lessonDbId not found throws', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(null);
      await controller.generateLessonExercises(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('success', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(77);
      mockGemini.generateExercises.mockResolvedValueOnce({ exercises: [ { q: 'q1' } ] });
      await controller.generateLessonExercises(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('deleteCourse', () => {
    it('not found throws', async () => {
      const req = { params: { courseId: 1 }, user: { id: 8 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.deleteCourse.mockResolvedValueOnce(false);
      await controller.deleteCourse(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    it('success', async () => {
      const req = { params: { courseId: 1 }, user: { id: 8 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.deleteCourse.mockResolvedValueOnce(true);
      await controller.deleteCourse(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('published endpoints', () => {
    it('getPublishedLanguages', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedLanguages.mockResolvedValueOnce([ { language: 'English' } ]);
      await controller.getPublishedLanguages({}, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('getPublishedLanguages error path calls next', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedLanguages.mockRejectedValueOnce(new Error('fail'));
      await controller.getPublishedLanguages({}, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('getPublishedCoursesByLanguage: missing language throws', async () => {
      const res = resMock(); const next = nextMock();
      await controller.getPublishedCoursesByLanguage({ params: {} }, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('getPublishedCoursesByLanguage: success', async () => {
      const res = resMock(); const next = nextMock();
      await controller.getPublishedCoursesByLanguage({ params: { language: 'English' } }, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('getPublishedCoursesByLanguage error path calls next', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedCoursesByLanguage.mockRejectedValueOnce(new Error('fail'));
      await controller.getPublishedCoursesByLanguage({ params: { language: 'English' } }, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('getPublishedCourseDetails: missing courseId throws', async () => {
      const res = resMock(); const next = nextMock();
      await controller.getPublishedCourseDetails({ params: {} }, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('getPublishedCourseDetails: not found throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedCourseDetails.mockResolvedValueOnce(null);
      await controller.getPublishedCourseDetails({ params: { courseId: 1 } }, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('getPublishedCourseDetails: success', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedCourseDetails.mockResolvedValueOnce({ id: 1 });
      await controller.getPublishedCourseDetails({ params: { courseId: 1 } }, res, next);
      expect(res.json).toHaveBeenCalled();
    });
    it("throws when expertise missing", async () => {
  const req = { query: { language: "English", expectedDuration: "4w" }, user: { id: 1 } };
  const res = resSSEMock();

  await controller.generateCourseStream(req, res, nextMock());

  expect(res.write).toHaveBeenCalled();
  expect(res.end).toHaveBeenCalled();
});
it("handles empty outline (no units)", async () => {
  const req = { query: { language: "English", expectedDuration: "4w", expertise: "Beginner" }, user: { id: 10 } };
  const res = resSSEMock();
  
  mockGemini.generateCourseOutline.mockResolvedValueOnce({ units: [] });

  await controller.generateCourseStream(req, res, nextMock());

  expect(res.write).toHaveBeenCalled();
  expect(res.end).toHaveBeenCalled();
});
it("handles invalid generated unit", async () => {
  const req = { query: { language: "English", expectedDuration: "4w", expertise: "Beginner" }, user: { id: 10 } };
  const res = resSSEMock();

  mockGemini.generateCourseOutline.mockResolvedValueOnce(outlineOneUnit);
  mockGemini.generateUnit.mockResolvedValueOnce({}); // invalid

  await controller.generateCourseStream(req, res, nextMock());

  expect(res.write).toHaveBeenCalled();
  expect(res.end).toHaveBeenCalled();
});
it("handles error when creating course fails", async () => {
  const req = { query: { language: "English", expectedDuration: "4w", expertise: "Beginner" }, user: { id: 1 } };
  const res = resSSEMock();

  mockGemini.generateCourseOutline.mockResolvedValueOnce(outlineOneUnit);
  mockGemini.generateUnit.mockResolvedValueOnce(unitGenerated);
  mockCourseRepo.createCourse.mockRejectedValueOnce(new Error("DB fail"));

  await controller.generateCourseStream(req, res, nextMock());

  expect(res.write).toHaveBeenCalled();
  expect(res.end).toHaveBeenCalled();
});
it("handles multi-unit where second unit generation fails", async () => {
  const req = { query: { language: "English", expectedDuration: "4w", expertise: "Beginner" }, user: { id: 1 } };
  const res = resSSEMock();

  const outlineTwoUnits = {
    units: [
      { id: 1, lessons: [ { id: 1 } ] },
      { id: 2, lessons: [ { id: 2 } ] }
    ]
  };

  mockGemini.generateCourseOutline.mockResolvedValueOnce(outlineTwoUnits);
  mockGemini.generateUnit
    .mockResolvedValueOnce(unitGenerated) // first ok
    .mockRejectedValueOnce(new Error("fail")); // second fails

  await controller.generateCourseStream(req, res, nextMock());

  expect(res.write).toHaveBeenCalled();
  expect(res.end).toHaveBeenCalled();
});

    it('getPublishedCourseDetails error path calls next', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedCourseDetails.mockRejectedValueOnce(new Error('fail'));
      await controller.getPublishedCourseDetails({ params: { courseId: 1 } }, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
