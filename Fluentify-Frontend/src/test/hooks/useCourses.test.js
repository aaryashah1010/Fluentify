/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mocks
const mockQueryClient = {
  invalidateQueries: jest.fn(),
};
const mockUseQueryClient = jest.fn(() => mockQueryClient);
const mockUseMutation = jest.fn();
const mockUseQuery = jest.fn();

// API Mocks
const mockCoursesApi = {
  fetchCourses: jest.fn(),
  generateCourse: jest.fn(),
  fetchCourseDetails: jest.fn(),
  fetchLessonDetails: jest.fn(),
  generateExercises: jest.fn(),
  completeLesson: jest.fn(),
  fetchPublishedLanguages: jest.fn(),
  fetchPublishedCoursesByLanguage: jest.fn(),
  fetchPublishedCourseDetails: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQueryClient: mockUseQueryClient,
  useMutation: mockUseMutation,
  useQuery: mockUseQuery,
}));

jest.unstable_mockModule('../../api/courses', () => mockCoursesApi);

describe('useCourses hooks', () => {
  let useCoursesHooks;

  beforeEach(async () => {
    jest.clearAllMocks();
    useCoursesHooks = await import('../../hooks/useCourses');
  });

  describe('useCourses', () => {
    it('should configure query correctly', () => {
      useCoursesHooks.useCourses();
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['courses'],
        queryFn: mockCoursesApi.fetchCourses,
      }));

      // Test select
      const { select } = mockUseQuery.mock.calls[0][0];
      expect(select({ data: [1, 2] })).toEqual([1, 2]);
      expect(select({})).toEqual([]);
    });
  });

  describe('useGenerateCourse', () => {
    it('should configure mutation correctly', () => {
      useCoursesHooks.useGenerateCourse();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockCoursesApi.generateCourse,
      }));

      // Test onSuccess
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      onSuccess();
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['courses'] });
    });
  });

  describe('useCourseDetails', () => {
    it('should configure query correctly', () => {
      useCoursesHooks.useCourseDetails(123);
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['course', 123],
        enabled: true,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockCoursesApi.fetchCourseDetails).toHaveBeenCalledWith(123);
    });

    it('should disable query if no courseId', () => {
      useCoursesHooks.useCourseDetails(null);
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });
  });

  describe('useLessonDetails', () => {
    it('should configure query correctly', () => {
      const params = { courseId: 1, unitId: 2, lessonId: 3 };
      useCoursesHooks.useLessonDetails(params);
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['lesson', 1, 2, 3],
        enabled: true,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockCoursesApi.fetchLessonDetails).toHaveBeenCalledWith(params);
    });

    it('should disable query if params missing', () => {
      useCoursesHooks.useLessonDetails({ courseId: 1 });
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });
  });

  describe('useGenerateExercises', () => {
    it('should configure mutation correctly', () => {
      useCoursesHooks.useGenerateExercises();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockCoursesApi.generateExercises,
      }));

      // Test onSuccess
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      const variables = { courseId: 1, unitId: 2, lessonId: 3 };
      onSuccess(null, variables);
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['lesson', 1, 2, 3],
      });
    });
  });

  describe('useCompleteLesson', () => {
    it('should configure mutation correctly', () => {
      useCoursesHooks.useCompleteLesson();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockCoursesApi.completeLesson,
      }));

      // Test onSuccess
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      const variables = { courseId: 1, unitId: 2, lessonId: 3 };
      onSuccess(null, variables);

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['lesson', 1, 2, 3],
      });
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['course', 1],
      });
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['courses'],
      });
    });
  });

  describe('usePublishedLanguages', () => {
    it('should configure query correctly', () => {
      useCoursesHooks.usePublishedLanguages();
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['published-languages'],
        queryFn: mockCoursesApi.fetchPublishedLanguages,
      }));

      // Test select
      const { select } = mockUseQuery.mock.calls[0][0];
      expect(select({ data: ['en', 'es'] })).toEqual(['en', 'es']);
      expect(select({})).toEqual([]);
    });
  });

  describe('usePublishedCoursesByLanguage', () => {
    it('should configure query correctly', () => {
      useCoursesHooks.usePublishedCoursesByLanguage('Spanish');
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['published-courses', 'Spanish'],
        enabled: true,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockCoursesApi.fetchPublishedCoursesByLanguage).toHaveBeenCalledWith('Spanish');

      // Test select
      const { select } = mockUseQuery.mock.calls[0][0];
      expect(select({ data: [1] })).toEqual([1]);
      expect(select({})).toEqual([]);
    });

    it('should disable query if no language', () => {
      useCoursesHooks.usePublishedCoursesByLanguage(null);
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });
  });

  describe('usePublishedCourseDetails', () => {
    it('should configure query correctly', () => {
      useCoursesHooks.usePublishedCourseDetails(123);
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['published-course', 123],
        enabled: true,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockCoursesApi.fetchPublishedCourseDetails).toHaveBeenCalledWith(123);

      // Test select
      const { select } = mockUseQuery.mock.calls[0][0];
      expect(select({ data: { id: 123 } })).toEqual({ id: 123 });
      expect(select({})).toBeNull();
    });

    it('should disable query if no courseId', () => {
      useCoursesHooks.usePublishedCourseDetails(null);
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });
  });
});
