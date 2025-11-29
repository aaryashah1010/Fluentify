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

const { ERRORS } = await import('../../utils/error.js');

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
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
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
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(res.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();

      // Initial logs
      expect(consoleLogSpy).toHaveBeenCalledWith('📥 Starting streaming course generation...');
      expect(consoleLogSpy).toHaveBeenCalledWith('🌍 Language:', 'English');
      expect(consoleLogSpy).toHaveBeenCalledWith('⏱️  Duration:', '4w');
      expect(consoleLogSpy).toHaveBeenCalledWith('🎓 Expertise:', 'Beginner');
      expect(consoleLogSpy).toHaveBeenCalledWith('🚀 Generating course outline...');

      // Unit generation logs
      expect(consoleLogSpy).toHaveBeenCalledWith('  📝 Generating Unit 1: Unit 1...');
      expect(consoleLogSpy).toHaveBeenCalledWith('  ✅ Unit 1 saved to database');

      // Course created and completed logs
      expect(consoleLogSpy).toHaveBeenCalledWith('Course 99 created, generating 1 units...');
      expect(consoleLogSpy).toHaveBeenCalledWith('🎉 Course 99 generation complete!');

      // Analytics for successful generation
      expect(mockAnalytics.trackAIGeneration).toHaveBeenCalledWith(
        1,
        'English',
        true,
        {
          courseId: 99,
          unitsGenerated: 1,
          lessonsGenerated: 1,
        },
      );

      // Verify final course_complete event payload
      const calls = res.write.mock.calls.map(c => c[0]);
      // course_created event
      const courseCreatedIndex = calls.indexOf('event: course_created\n');
      expect(courseCreatedIndex).toBeGreaterThan(-1);
      let dataLine = res.write.mock.calls[courseCreatedIndex + 1][0];
      expect(dataLine.startsWith('data: ')).toBe(true);
      let json = JSON.parse(dataLine.slice(6));
      expect(json).toEqual({
        courseId: 99,
        language: 'English',
        totalUnits: 1,
        message: 'Course created, generating units...',
      });

      // unit_generating event
      const unitGeneratingIndex = calls.indexOf('event: unit_generating\n');
      expect(unitGeneratingIndex).toBeGreaterThan(-1);
      dataLine = res.write.mock.calls[unitGeneratingIndex + 1][0];
      json = JSON.parse(dataLine.slice(6));
      expect(json).toEqual({
        unitNumber: 1,
        totalUnits: 1,
        title: 'Unit 1',
        message: 'Generating Unit 1: Unit 1...',
      });

      // unit_generated event
      const unitGeneratedIndex = calls.indexOf('event: unit_generated\n');
      expect(unitGeneratedIndex).toBeGreaterThan(-1);
      dataLine = res.write.mock.calls[unitGeneratedIndex + 1][0];
      json = JSON.parse(dataLine.slice(6));
      expect(json).toEqual({
        unitNumber: 1,
        totalUnits: 1,
        unit: unitGenerated,
        progress: '1/1',
        message: 'Unit 1 completed!',
      });

      const courseCompleteIndex = calls.indexOf('event: course_complete\n');
      expect(courseCompleteIndex).toBeGreaterThan(-1);
      dataLine = res.write.mock.calls[courseCompleteIndex + 1][0];
      expect(dataLine.startsWith('data: ')).toBe(true);
      json = JSON.parse(dataLine.slice(6));
      expect(json).toEqual({
        courseId: 99,
        language: 'English',
        totalUnits: 1,
        totalLessons: 1,
        estimatedTotalTime: 10,
        message: 'Course generation complete!',
      });

      // Initial courseData passed to createCourse should contain structured course and metadata
      const createArgs = mockCourseRepo.createCourse.mock.calls[0];
      expect(createArgs[0]).toBe(1);
      expect(createArgs[1]).toBe('English');
      expect(createArgs[2]).toBe('4w');
      const courseDataArg = createArgs[3];
      // course.totalLessons is mutated later during unit generation, so we don't assert it here
      expect(courseDataArg.course).toMatchObject({
        title: 'English Learning Journey',
        language: 'English',
        duration: '4w',
        version: '1.0',
      });
      expect(Array.isArray(courseDataArg.course.units)).toBe(true);
      // generatedAt is dynamic but should be a string
      expect(typeof courseDataArg.course.generatedAt).toBe('string');

      // metadata fields like totalLessons/estimatedTotalTime are updated during unit generation,
      // so here we assert the stable fields only
      expect(courseDataArg.metadata).toMatchObject({
        language: 'English',
        totalUnits: 1,
        createdBy: 'ai',
      });

      // populateCourseStructure should be called with the generated unit
      expect(mockCourseRepo.populateCourseStructure).toHaveBeenCalledWith(99, {
        course: { units: [unitGenerated] },
      });
    });

    it('uses default expertise when not provided (Beginner)', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockResolvedValueOnce(outlineOneUnit);
      mockGemini.generateUnit.mockResolvedValueOnce(unitGenerated);
      mockCourseRepo.createCourse.mockResolvedValueOnce(42);

      await controller.generateCourseStream(req, res, next);

      expect(mockGemini.generateCourseOutline).toHaveBeenCalledWith('English', '4w', 'Beginner');
      expect(mockGemini.generateUnit).toHaveBeenCalledWith('English', outlineOneUnit.units[0], 1, 'Beginner');
      expect(consoleLogSpy).toHaveBeenCalledWith('🎓 Expertise:', 'Beginner');
    });

    it('handles error path and writes error event', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockRejectedValueOnce(new Error('429 Too Many Requests'));

      await controller.generateCourseStream(req, res, next);
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in streaming course generation:',
        expect.any(Error),
      );

      // Analytics for failed generation
      expect(mockAnalytics.trackAIGeneration).toHaveBeenCalledWith(
        1,
        'English',
        false,
        { errorMessage: '429 Too Many Requests' },
      );

      // SSE error event and friendly rate-limit message
      const calls = res.write.mock.calls;
      const lastTwo = calls.slice(-2);
      expect(lastTwo[0][0]).toBe('event: error\n');
      const dataLine = lastTwo[1][0];
      expect(dataLine.startsWith('data: ')).toBe(true);
      const json = JSON.parse(dataLine.slice(6));
      expect(json).toEqual({
        message: 'API rate limit exceeded. Please wait a few minutes and try again.',
      });
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

      // Should still call analytics with success=true and proper payload
      expect(mockAnalytics.trackAIGeneration).toHaveBeenCalledWith(
        1,
        'English',
        true,
        {
          courseId: 99,
          unitsGenerated: 1,
          lessonsGenerated: 1,
        },
      );

      // And log the analytics failure without failing the request
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error tracking AI generation analytics:',
        expect.any(Error),
      );
    });

    it('throws MISSING_REQUIRED_FIELDS when language or duration missing', async () => {
      const req = { query: { expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      await controller.generateCourseStream(req, res, next);
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in streaming course generation:',
        expect.any(Error),
      );

      const calls = res.write.mock.calls;
      const lastTwo = calls.slice(-2);
      expect(lastTwo[0][0]).toBe('event: error\n');
      const dataLine = lastTwo[1][0];
      const json = JSON.parse(dataLine.slice(6));
      // When not a 429 error, we fall back to the real error message
      expect(json).toEqual({ message: ERRORS.MISSING_REQUIRED_FIELDS.message });
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
      // Delay log should be printed exactly once (between units)
      const delayLogs = consoleLogSpy.mock.calls
        .map(c => c[0])
        .filter(msg => msg === '  ⏳ Waiting 3 seconds before next unit to avoid rate limits...');
      expect(delayLogs).toHaveLength(1);
      expect(res.end).toHaveBeenCalled();
      timeoutSpy.mockRestore();
    });

    it('maps pure "Too Many Requests" message to friendly rate limit', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockRejectedValueOnce(new Error('Too Many Requests'));

      await controller.generateCourseStream(req, res, next);

      const calls = res.write.mock.calls;
      const lastTwo = calls.slice(-2);
      expect(lastTwo[0][0]).toBe('event: error\n');
      const dataLine = lastTwo[1][0];
      const json = JSON.parse(dataLine.slice(6));
      expect(json).toEqual({
        message: 'API rate limit exceeded. Please wait a few minutes and try again.',
      });
    });

    it('error path where analytics tracking of failure also fails', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w' }, user: { id: 1 } };
      const res = resSSEMock(); const next = nextMock();
      mockGemini.generateCourseOutline.mockRejectedValueOnce(new Error('rate limited'));
      mockAnalytics.trackAIGeneration.mockRejectedValueOnce(new Error('analytics fail'));
      await controller.generateCourseStream(req, res, next);
      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in streaming course generation:',
        expect.any(Error),
      );

      // Called with original error message
      expect(mockAnalytics.trackAIGeneration).toHaveBeenCalledWith(
        1,
        'English',
        false,
        { errorMessage: 'rate limited' },
      );

      // Analytics failure is logged but does not crash
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error tracking failed AI generation analytics:',
        expect.any(Error),
      );

      // SSE data uses the error.message when not a rate limit pattern
      const calls = res.write.mock.calls;
      const lastTwo = calls.slice(-2);
      const dataLine = lastTwo[1][0];
      const json = JSON.parse(dataLine.slice(6));
      expect(json).toEqual({ message: 'rate limited' });
    });
 
    it('does not attempt analytics when user missing in error path', async () => {
      const req = { query: { language: 'English', expectedDuration: '4w' } };
      const res = resSSEMock(); const next = nextMock();

      // Trigger an error before any outline is generated
      mockGemini.generateCourseOutline.mockRejectedValueOnce(new Error('some error'));

      await controller.generateCourseStream(req, res, next);

      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();

      // No analytics should be tracked and no analytics failure should be logged
      expect(mockAnalytics.trackAIGeneration).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        'Error tracking failed AI generation analytics:',
        expect.any(Error),
      );
    });

    it('handles missing query safely in error analytics block', async () => {
      const req = { user: { id: 1 } }; // no query object at all
      const res = resSSEMock(); const next = nextMock();

      mockGemini.generateCourseOutline.mockRejectedValueOnce(new Error('generic failure'));

      await controller.generateCourseStream(req, res, next);

      expect(res.write).toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
      // Should not attempt analytics and should not log analytics error
      expect(mockAnalytics.trackAIGeneration).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        'Error tracking failed AI generation analytics:',
        expect.any(Error),
      );
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
      // Assert logs and payload from createdResponse
      expect(consoleLogSpy).toHaveBeenCalledWith('📥 Received request body:', req.body);
      expect(consoleLogSpy).toHaveBeenCalledWith('🌍 Language:', 'English');
      expect(consoleLogSpy).toHaveBeenCalledWith('⏱️  Duration:', '4w');
      expect(consoleLogSpy).toHaveBeenCalledWith('🎓 Expertise:', 'Intermediate');
      expect(consoleLogSpy).toHaveBeenCalledWith('🚀 Starting course generation for English...');
      expect(consoleLogSpy).toHaveBeenCalledWith('Saving course to database...');
      expect(consoleLogSpy).toHaveBeenCalledWith('Course created successfully with ID: 101');

      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Course generated successfully!',
        data: {
          id: 101,
          language: 'English',
          title: 'T',
          totalUnits: 1,
          totalLessons: 1,
          estimatedTotalTime: 10,
        },
      });
    });

    it('missing both language and expectedDuration throws', async () => {
      const req = { body: { }, user: { id: 2 } }; const res = resMock(); const next = nextMock();
      await controller.generateCourse(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating course:', err);
    });
    it('missing language throws', async () => {
      const req = { body: { expectedDuration: '4w' }, user: { id: 2 } }; const res = resMock(); const next = nextMock();
      await controller.generateCourse(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LANGUAGE_REQUIRED);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating course:', err);
      // Default expertise should be Beginner when not provided
      expect(consoleLogSpy).toHaveBeenCalledWith('🎓 Expertise:', 'Beginner');
    });
    it('missing expectedDuration throws', async () => {
      const req = { body: { language: 'English' }, user: { id: 2 } }; const res = resMock(); const next = nextMock();
      await controller.generateCourse(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.DURATION_REQUIRED);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating course:', err);
    });
  });

  describe('getLearnerCourses', () => {
    it('returns list', async () => {
      const req = { user: { id: 3 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findLearnerCoursesWithStats.mockResolvedValueOnce([
        { id: 1, language: 'English', title: 'T', description: 'D', expected_duration: '4w', total_units: 1, total_lessons: 2, estimated_total_time: 10, created_at: 'now', total_xp: 20, lessons_completed: 5, units_completed: 2, current_streak: 3, progress_percentage: 40 }
      ]);
      await controller.getLearnerCourses(req, res, next);
      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Courses retrieved successfully',
      });
      expect(payload.data).toEqual([
        {
          id: 1,
          language: 'English',
          title: 'T',
          description: 'D',
          expectedDuration: '4w',
          totalUnits: 1,
          totalLessons: 2,
          estimatedTotalTime: 10,
          createdAt: 'now',
          progress: {
            totalXp: 20,
            lessonsCompleted: 5,
            unitsCompleted: 2,
            currentStreak: 3,
            progressPercentage: 40,
          },
        },
      ]);
    });

    it('maps courses with fallback values when fields are missing/zero', async () => {
      const req = { user: { id: 3 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findLearnerCoursesWithStats.mockResolvedValueOnce([
        {
          id: 2,
          language: 'Spanish',
          title: null,
          description: null,
          expected_duration: null,
          total_units: 0,
          total_lessons: 0,
          estimated_total_time: 0,
          created_at: 'now2',
          total_xp: 0,
          lessons_completed: 0,
          units_completed: 0,
          current_streak: 0,
          progress_percentage: 0,
        },
      ]);

      await controller.getLearnerCourses(req, res, next);

      const payload = res.body;
      expect(payload.message).toBe('Courses retrieved successfully');
      expect(payload.data).toHaveLength(1);
      const course = payload.data[0];
      expect(course.id).toBe(2);
      expect(course.language).toBe('Spanish');
      // title falls back when missing
      expect(course.title).toBe('Spanish Course');
      // numeric fields fall back to 0
      expect(course.totalUnits).toBe(0);
      expect(course.totalLessons).toBe(0);
      expect(course.estimatedTotalTime).toBe(0);
      expect(course.progress).toMatchObject({
        totalXp: 0,
        lessonsCompleted: 0,
        unitsCompleted: 0,
        currentStreak: 0,
        progressPercentage: 0,
      });
    });

    it('error path calls next()', async () => {
      const req = { user: { id: 3 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findLearnerCoursesWithStats.mockRejectedValueOnce(new Error('fail'));
      await controller.getLearnerCourses(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBeTruthy();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching courses:', err);
    });
  });

  describe('getCourseDetails', () => {
    it('success with progress maps', async () => {
      const req = { params: { courseId: 1 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      const courseData = { course: { title: 'T', duration: '4w', units: [ { id: 1, lessons: [ { id: 1 }, { id: 2 } ] } ] } };
      mockCourseRepo.findCourseById.mockResolvedValueOnce({ id: 1, language: 'English', course_data: courseData });
      mockProgressRepo.findUnitProgress.mockResolvedValueOnce([ { unit_id: 1, is_unlocked: true, is_completed: true } ]);
      mockProgressRepo.findLessonProgress.mockResolvedValueOnce([ { unit_id: 1, lesson_id: 1, is_completed: true, score: 80, xp_earned: 50 } ]);
      mockProgressRepo.findUserStats.mockResolvedValueOnce({ total_xp: 10, lessons_completed: 1, units_completed: 0, current_streak: 1, longest_streak: 1 });
      await controller.getCourseDetails(req, res, next);
      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Course details retrieved successfully',
      });
      expect(payload.data.course).toBeDefined();
      expect(payload.data.course.id).toBe(1);
      expect(payload.data.course.language).toBe('English');
      expect(payload.data.course.title).toBe('T');
      expect(payload.data.course.duration).toBe('4w');

      const units = payload.data.course.units;
      expect(units).toHaveLength(1);
      const unit = units[0];
      expect(unit.id).toBe(1);
      expect(unit.isUnlocked).toBe(true);
      // Uses unitProgressMap values instead of default
      expect(unit.isCompleted).toBe(true);
      expect(unit.lessons).toHaveLength(2);

      const [lesson1, lesson2] = unit.lessons;
      expect(lesson1).toMatchObject({
        id: 1,
        isUnlocked: true,
        isCompleted: true,
        score: 80,
        xpEarned: 50,
      });
      expect(lesson2).toMatchObject({
        id: 2,
        isUnlocked: true,
        isCompleted: false,
        score: 0,
        xpEarned: 0,
      });

      expect(payload.data.stats).toMatchObject({
        total_xp: 10,
        lessons_completed: 1,
        units_completed: 0,
        current_streak: 1,
        longest_streak: 1,
      });
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
      expect(payload).toMatchObject({
        success: true,
        message: 'Course details retrieved successfully',
      });
      // Fallback stats
      expect(payload.data.stats.total_xp).toBe(0);
      expect(payload.data.stats.lessons_completed).toBe(0);

      // Fallback unit progress: first unit unlocked and not completed
      const unit = payload.data.course.units[0];
      expect(unit.isUnlocked).toBe(true);
      expect(unit.isCompleted).toBe(false);
    });

    it('defaults only first unit unlocked when there is no unit progress', async () => {
      const req = { params: { courseId: 3 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      const courseData = {
        course: {
          title: 'T3',
          duration: '4w',
          units: [
            { id: 1, lessons: [ { id: 1 } ] },
            { id: 2, lessons: [ { id: 1 } ] },
          ],
        },
      };

      mockCourseRepo.findCourseById.mockResolvedValueOnce({ id: 3, language: 'English', course_data: courseData });
      mockProgressRepo.findUnitProgress.mockResolvedValueOnce([]);
      mockProgressRepo.findLessonProgress.mockResolvedValueOnce([]);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      await controller.getCourseDetails(req, res, next);

      const payload = res.body;
      const units = payload.data.course.units;
      expect(units).toHaveLength(2);
      expect(units[0].isUnlocked).toBe(true);
      expect(units[0].isCompleted).toBe(false);
      expect(units[1].isUnlocked).toBe(false);
      expect(units[1].isCompleted).toBe(false);
    });

    it('throws on course not found', async () => {
      const req = { params: { courseId: 1 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseById.mockResolvedValueOnce(null);
      await controller.getCourseDetails(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.COURSE_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching course details:', err);
    });

    it('parsing course_data throws -> INVALID_COURSE_DATA', async () => {
      const req = { params: { courseId: 1 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      const course = {};
      Object.defineProperty(course, 'course_data', { get() { throw new Error('parse'); } });
      mockCourseRepo.findCourseById.mockResolvedValueOnce(course);
      await controller.getCourseDetails(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.INVALID_COURSE_DATA);
      // Inner parse error log
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing course_data:', expect.any(Error));
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching course details:', err);
    });

    it('locks second lesson when previous is not completed', async () => {
      const req = { params: { courseId: 2 }, user: { id: 4 } }; const res = resMock(); const next = nextMock();
      const courseData = { course: { title: 'T2', duration: '4w', units: [ { id: 1, lessons: [ { id: 1 }, { id: 2 } ] } ] } };

      mockCourseRepo.findCourseById.mockResolvedValueOnce({ id: 2, language: 'English', course_data: courseData });
      mockProgressRepo.findUnitProgress.mockResolvedValueOnce([ { unit_id: 1, is_unlocked: true, is_completed: false } ]);
      // No lesson progress -> previousCompleted should be false for second lesson
      mockProgressRepo.findLessonProgress.mockResolvedValueOnce([]);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      await controller.getCourseDetails(req, res, next);

      const payload = res.body;
      const unit = payload.data.course.units[0];
      const [lesson1, lesson2] = unit.lessons;
      expect(lesson1.isUnlocked).toBe(true);
      expect(lesson2.isUnlocked).toBe(false);
    });
  });

  describe('getLessonDetails', () => {
    it('course not found throws', async () => {
      const req = { params: { courseId: 1, unitId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      await controller.getLessonDetails(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.COURSE_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching lesson details:', err);
    });
    it('lesson not found throws', async () => {
      const req = { params: { courseId: 1, unitId: 1, lessonId: 9 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [] } ] } } });
      await controller.getLessonDetails(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LESSON_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching lesson details:', err);
    });
    it('success', async () => {
      const req = { params: { courseId: 1, unitId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce({ is_completed: true });
      await controller.getLessonDetails(req, res, next);
      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Lesson details retrieved successfully',
      });
      expect(payload.data.lesson).toMatchObject({ id: 1 });
      expect(payload.data.progress).toEqual({ is_completed: true });
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
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.COURSE_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching lesson details (legacy):', err);
    });
    it('lesson not found throws', async () => {
      const req = { params: { courseId: 1, lessonId: 9 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      await controller.getLessonDetailsLegacy(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LESSON_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching lesson details (legacy):', err);
    });
    it('success', async () => {
      const req = { params: { courseId: 1, lessonId: 1 }, user: { id: 5 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce({});
      await controller.getLessonDetailsLegacy(req, res, next);
      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Lesson details retrieved successfully',
      });
      expect(payload.data.lesson).toMatchObject({ id: 1 });
      expect(payload.data.unitId).toBe(1);
      expect(payload.data.progress).toEqual({});
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
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.COURSE_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error completing lesson (legacy):', err);
    });

    it('lesson not found throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [] } ] } } });
      await controller.completeLessonLegacy(baseReq, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LESSON_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error completing lesson (legacy):', err);
    });

    it('exercises failing rule returns 400', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      const req = { ...baseReq, body: { exercises: [ { isCorrect: false }, { isCorrect: false }, { isCorrect: false }, { isCorrect: false }, { isCorrect: false } ] } };
      await controller.completeLessonLegacy(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const payload = res.body;
      expect(payload).toMatchObject({
        success: false,
        message: 'You need at least 3 out of 5 correct answers to complete this lesson',
        data: {
          correctAnswers: 0,
          totalExercises: 5,
          passed: false,
        },
      });
    });

    it('lessonDbId not found throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(null);
      await controller.completeLessonLegacy(baseReq, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LESSON_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error completing lesson (legacy):', err);
    });

    it('existing progress completed throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce({ is_completed: true });
      await controller.completeLessonLegacy(baseReq, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LESSON_ALREADY_COMPLETED);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error completing lesson (legacy):', err);
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
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        data: {
          xpEarned: 50,
          unitCompleted: false,
          nextLessonId: 2,
        },
      });
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Lesson 1 completed! XP: 50, Unit completed: false');
      // When stats do not exist, createUserStats should be called
      expect(mockProgressRepo.createUserStats).toHaveBeenCalled();
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
      const payload = res.body;
      expect(payload.data.unitCompleted).toBe(true);
      expect(payload.message).toBe('Unit completed! Next unit unlocked!');
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Lesson 1 completed! XP: 50, Unit completed: true');
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
      const args = mockProgressRepo.updateUserStreak.mock.calls[0];
      expect(args[2]).toBe(3); // 2 + 1
      // today argument should be a YYYY-MM-DD string
      expect(typeof args[3]).toBe('string');
      expect(args[3]).toHaveLength(10);
      expect(args[3]).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('creates exercise attempts when exercises pass rule', async () => {
      const res = resMock(); const next = nextMock();
      const req = {
        ...baseReq,
        body: {
          score: 80,
          exercises: [
            { isCorrect: true, userAnswer: 'a' },
            { isCorrect: true }, // no userAnswer -> fallback to ''
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
      const [firstCall] = mockProgressRepo.createExerciseAttempt.mock.calls;
      // userId, courseId, foundUnitId, lessonDbId, index, isCorrect, userAnswer
      expect(firstCall[5]).toBe(true);
      expect(firstCall[6]).toBe('a');

      // Second attempt should use fallback '' for missing userAnswer
      const secondCall = mockProgressRepo.createExerciseAttempt.mock.calls[1];
      expect(secondCall[5]).toBe(true);
      expect(secondCall[6]).toBe('');
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

    it('applies xp fallback when xpReward missing', async () => {
      const res = resMock(); const next = nextMock();
      const noXpCourseData = { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } };
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: noXpCourseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      await controller.completeLessonLegacy(baseReq, res, next);

      const payload = res.body;
      expect(payload.data.xpEarned).toBe(50);
    });

    it('handles missing body and uses default score and no exercises', async () => {
      const res = resMock(); const next = nextMock();
      const req = { params: { courseId: 1, lessonId: 1 }, user: { id: 6 } }; // no body
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: courseData });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(55);
      mockProgressRepo.findSpecificLessonProgress.mockResolvedValueOnce(null);
      mockProgressRepo.countCompletedLessonsInUnit.mockResolvedValueOnce(0);
      mockProgressRepo.findUserStats.mockResolvedValueOnce(null);

      await controller.completeLessonLegacy(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data.xpEarned).toBe(50);
      // Default score should be 100
      const upsertArgs = mockProgressRepo.upsertLessonProgress.mock.calls[0];
      expect(upsertArgs[4]).toBe(100);
      // No exercises should be created
      expect(mockProgressRepo.createExerciseAttempt).not.toHaveBeenCalled();
    });
  });

  describe('generateLessonExercises', () => {
    const baseParams = { courseId: 1, unitId: 1, lessonId: 1 };
    it('course not found throws', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce(null);
      await controller.generateLessonExercises(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.COURSE_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating lesson exercises:', err);
    });
    it('lesson not found throws', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [] } ] } } });
      await controller.generateLessonExercises(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LESSON_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating lesson exercises:', err);
    });
    it('lessonDbId not found throws', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(null);
      await controller.generateLessonExercises(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.LESSON_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating lesson exercises:', err);
    });
    it('success', async () => {
      const req = { params: baseParams, user: { id: 1 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: { course: { units: [ { id: 1, lessons: [ { id: 1 } ] } ] } } });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(77);
      mockGemini.generateExercises.mockResolvedValueOnce({ exercises: [ { q: 'q1' } ] });
      await controller.generateLessonExercises(req, res, next);
      expect(res.json).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('🎯 Generating exercises for lesson 1...');
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Exercises generated successfully',
        data: { exercises: [ { q: 'q1' } ] },
      });
    });

    it('selects correct unit when multiple units present', async () => {
      const req = { params: { courseId: 1, unitId: 2, lessonId: 1 }, user: { id: 1 } };
      const res = resMock(); const next = nextMock();
      const multiUnitCourse = {
        course: {
          units: [
            { id: 1, lessons: [ { id: 99 } ] },
            { id: 2, lessons: [ { id: 1 } ] },
          ],
        },
      };

      mockCourseRepo.findCourseDataById.mockResolvedValueOnce({ course_data: multiUnitCourse });
      mockCourseRepo.findLessonDbId.mockResolvedValueOnce(77);
      mockGemini.generateExercises.mockResolvedValueOnce({ exercises: [ { q: 'q1' } ] });

      await controller.generateLessonExercises(req, res, next);

      expect(res.json).toHaveBeenCalled();
      const payload = res.body;
      expect(payload.data.exercises).toEqual([ { q: 'q1' } ]);
    });
  });

  describe('deleteCourse', () => {
    it('not found throws', async () => {
      const req = { params: { courseId: 1 }, user: { id: 8 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.deleteCourse.mockResolvedValueOnce(false);
      await controller.deleteCourse(req, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.COURSE_NOT_FOUND);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting course:', err);
    });
    it('success', async () => {
      const req = { params: { courseId: 1 }, user: { id: 8 } }; const res = resMock(); const next = nextMock();
      mockCourseRepo.deleteCourse.mockResolvedValueOnce(true);
      await controller.deleteCourse(req, res, next);
      expect(res.json).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('🗑️  Deleting course 1 for user 8...');
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Course 1 deleted successfully');
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Course and all related data deleted successfully!',
        data: { courseId: 1 },
      });
    });
  });

  describe('published endpoints', () => {
    it('getPublishedLanguages', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedLanguages.mockResolvedValueOnce([ { language: 'English' } ]);
      await controller.getPublishedLanguages({}, res, next);
      expect(res.json).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('📚 Fetching published languages...');
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Published languages retrieved successfully',
        data: [ { language: 'English' } ],
      });
    });

    it('getPublishedLanguages error path calls next', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedLanguages.mockRejectedValueOnce(new Error('fail'));
      await controller.getPublishedLanguages({}, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBeTruthy();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching published languages:', err);
    });

    it('getPublishedCoursesByLanguage: missing language throws', async () => {
      const res = resMock(); const next = nextMock();
      await controller.getPublishedCoursesByLanguage({ params: {} }, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('getPublishedCoursesByLanguage: success', async () => {
      const res = resMock(); const next = nextMock();
      await controller.getPublishedCoursesByLanguage({ params: { language: 'English' } }, res, next);
      expect(res.json).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('📖 Fetching published courses for language: English');
      const payload = res.body;
      expect(payload.message).toBe('Published courses for English retrieved successfully');
    });

    it('getPublishedCoursesByLanguage error path calls next', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedCoursesByLanguage.mockRejectedValueOnce(new Error('fail'));
      await controller.getPublishedCoursesByLanguage({ params: { language: 'English' } }, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBeTruthy();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching published courses:', err);
    });

    it('getPublishedCourseDetails: missing courseId throws', async () => {
      const res = resMock(); const next = nextMock();
      await controller.getPublishedCourseDetails({ params: {} }, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('getPublishedCourseDetails: not found throws', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedCourseDetails.mockResolvedValueOnce(null);
      await controller.getPublishedCourseDetails({ params: { courseId: 1 } }, res, next);
      const err = next.mock.calls[0][0];
      expect(err).toBe(ERRORS.COURSE_NOT_FOUND);
    });

    it('getPublishedCourseDetails: success', async () => {
      const res = resMock(); const next = nextMock();
      mockCourseRepo.getPublishedCourseDetails.mockResolvedValueOnce({ id: 1 });
      await controller.getPublishedCourseDetails({ params: { courseId: 1 } }, res, next);
      expect(res.json).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('📕 Fetching published course details for ID: 1');
      const payload = res.body;
      expect(payload).toMatchObject({
        success: true,
        message: 'Published course details retrieved successfully',
        data: { id: 1 },
      });
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
      const err = next.mock.calls[0][0];
      expect(err).toBeTruthy();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching published course details:', err);
    });
  });
});
