import { jest } from '@jest/globals';

// ------------------------------
// Mocks
// ------------------------------

const mockHandleResponse = jest.fn(async (response) => ({ ok: true, response }));
const mockGetAuthHeader = jest.fn(() => ({ Authorization: 'Bearer test-token', 'Content-Type': 'application/json' }));

await jest.unstable_mockModule('../../api/apiHelpers.js', () => ({
  API_BASE_URL: 'http://test-base',
  handleResponse: mockHandleResponse,
  getAuthHeader: mockGetAuthHeader,
}));

// Import module under test AFTER mocks
const coursesApi = await import('../../api/courses.js');

const makeOkResponse = () => ({ ok: true, status: 200 });

describe('courses API client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn().mockResolvedValue(makeOkResponse());
  });

  describe('Learner course operations', () => {
    it('fetchCourses gets courses with auth header', async () => {
      await coursesApi.fetchCourses();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('generateCourse posts language and expectedDuration', async () => {
      const payload = { language: 'Spanish', expectedDuration: '4 weeks' };

      await coursesApi.generateCourse(payload);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/generate',
        {
          method: 'POST',
          headers: mockGetAuthHeader(),
          body: JSON.stringify(payload),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('fetchCourseDetails gets course by id', async () => {
      await coursesApi.fetchCourseDetails(42);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/42',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('fetchLessonDetails gets nested lesson route', async () => {
      const params = { courseId: 1, unitId: 2, lessonId: 3 };

      await coursesApi.fetchLessonDetails(params);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/1/units/2/lessons/3',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('generateExercises posts to generate exercises endpoint', async () => {
      const params = { courseId: 1, unitId: 2, lessonId: 3 };

      await coursesApi.generateExercises(params);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/1/units/2/lessons/3/exercises/generate',
        {
          method: 'POST',
          headers: mockGetAuthHeader(),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('completeLesson posts score and exercises to legacy completion route', async () => {
      const args = {
        courseId: 5,
        unitId: 99,
        lessonId: 7,
        score: 80,
        exercises: [{ id: 1 }],
      };

      await coursesApi.completeLesson(args);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/5/lessons/7/complete',
        {
          method: 'POST',
          headers: mockGetAuthHeader(),
          body: JSON.stringify({ score: 80, exercises: [{ id: 1 }] }),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('completeLesson uses default score and exercises when not provided', async () => {
      await coursesApi.completeLesson({ courseId: 2, unitId: 1, lessonId: 9 });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/2/lessons/9/complete',
        {
          method: 'POST',
          headers: mockGetAuthHeader(),
          body: JSON.stringify({ score: 100, exercises: [] }),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('deleteCourse sends DELETE with auth header', async () => {
      await coursesApi.deleteCourse(13);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/13',
        {
          method: 'DELETE',
          headers: mockGetAuthHeader(),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('Public course endpoints (no auth)', () => {
    it('getPublishedLanguages hits public languages endpoint without headers', async () => {
      await coursesApi.getPublishedLanguages();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/public/languages'
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('getPublishedCoursesByLanguage hits public courses-by-language endpoint', async () => {
      await coursesApi.getPublishedCoursesByLanguage('French');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/public/languages/French/courses'
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('getPublishedCourseDetails hits public course details endpoint', async () => {
      await coursesApi.getPublishedCourseDetails(77);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/courses/public/courses/77'
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('Authenticated learner module endpoints', () => {
    it('fetchPublishedLanguages gets learner modules languages with auth header', async () => {
      await coursesApi.fetchPublishedLanguages();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/learner-modules/languages',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('fetchPublishedCoursesByLanguage hits learner modules courses endpoint', async () => {
      await coursesApi.fetchPublishedCoursesByLanguage('German');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/learner-modules/languages/German/courses',
        {
          headers: mockGetAuthHeader(),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });

    it('fetchPublishedCourseDetails hits learner modules course details endpoint', async () => {
      await coursesApi.fetchPublishedCourseDetails(88);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/learner-modules/courses/88',
        {
          headers: mockGetAuthHeader(),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });
});
