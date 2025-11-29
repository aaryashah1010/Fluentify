/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mocks
const mockUseQuery = jest.fn();

// API Mocks
const mockCoursesApi = {
  fetchPublishedLanguages: jest.fn(),
  fetchPublishedCoursesByLanguage: jest.fn(),
  fetchPublishedCourseDetails: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

jest.unstable_mockModule('../../api/courses', () => mockCoursesApi);

describe('usePublishedModules hooks', () => {
  let usePublishedModulesHooks;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    usePublishedModulesHooks = await import('../../hooks/usePublishedModules');
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('usePublishedLanguages', () => {
    it('should configure query correctly', () => {
      usePublishedModulesHooks.usePublishedLanguages();

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['publishedLanguages'],
        staleTime: 300000,
      }));
    });

    it('should fetch and return data successfully', async () => {
      mockCoursesApi.fetchPublishedLanguages.mockResolvedValue({
        data: ['English', 'Spanish']
      });

      usePublishedModulesHooks.usePublishedLanguages();
      const { queryFn } = mockUseQuery.mock.calls[0][0];

      const result = await queryFn();
      expect(result).toEqual(['English', 'Spanish']);
      expect(console.log).toHaveBeenCalled();
    });

    it('should handle missing data property', async () => {
      mockCoursesApi.fetchPublishedLanguages.mockResolvedValue({});

      usePublishedModulesHooks.usePublishedLanguages();
      const { queryFn } = mockUseQuery.mock.calls[0][0];

      const result = await queryFn();
      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      const error = new Error('API Error');
      mockCoursesApi.fetchPublishedLanguages.mockRejectedValue(error);

      usePublishedModulesHooks.usePublishedLanguages();
      const { queryFn } = mockUseQuery.mock.calls[0][0];

      await expect(queryFn()).rejects.toThrow('API Error');
      expect(console.error).toHaveBeenCalledWith('Error fetching published languages:', error);
    });
  });

  describe('usePublishedCoursesByLanguage', () => {
    it('should configure query correctly with language', () => {
      usePublishedModulesHooks.usePublishedCoursesByLanguage('Spanish');

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['publishedCourses', 'Spanish'],
        enabled: true,
        staleTime: 300000,
      }));
    });

    it('should disable query when no language', () => {
      usePublishedModulesHooks.usePublishedCoursesByLanguage(null);

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });

    it('should fetch and return data successfully', async () => {
      mockCoursesApi.fetchPublishedCoursesByLanguage.mockResolvedValue({
        data: [{ id: 1, name: 'Course 1' }]
      });

      usePublishedModulesHooks.usePublishedCoursesByLanguage('English');
      const { queryFn } = mockUseQuery.mock.calls[0][0];

      const result = await queryFn();
      expect(result).toEqual([{ id: 1, name: 'Course 1' }]);
    });

    it('should handle missing data property', async () => {
      mockCoursesApi.fetchPublishedCoursesByLanguage.mockResolvedValue({});

      usePublishedModulesHooks.usePublishedCoursesByLanguage('French');
      const { queryFn } = mockUseQuery.mock.calls[0][0];

      const result = await queryFn();
      expect(result).toEqual([]);
    });
  });

  describe('usePublishedCourseDetails', () => {
    it('should configure query correctly with courseId', () => {
      usePublishedModulesHooks.usePublishedCourseDetails(123);

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['publishedCourseDetails', 123],
        enabled: true,
        staleTime: 300000,
      }));
    });

    it('should disable query when no courseId', () => {
      usePublishedModulesHooks.usePublishedCourseDetails(null);

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });

    it('should fetch and return data successfully', async () => {
      mockCoursesApi.fetchPublishedCourseDetails.mockResolvedValue({
        data: { id: 123, title: 'Course Details' }
      });

      usePublishedModulesHooks.usePublishedCourseDetails(123);
      const { queryFn } = mockUseQuery.mock.calls[0][0];

      const result = await queryFn();
      expect(result).toEqual({ id: 123, title: 'Course Details' });
    });

    it('should handle missing data property', async () => {
      mockCoursesApi.fetchPublishedCourseDetails.mockResolvedValue({});

      usePublishedModulesHooks.usePublishedCourseDetails(456);
      const { queryFn } = mockUseQuery.mock.calls[0][0];

      const result = await queryFn();
      expect(result).toEqual({});
    });
  });
});
