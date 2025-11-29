/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mocks
const mockUseQuery = jest.fn();

// API Mocks
const mockProgressApi = {
  fetchProgressReport: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQuery: mockUseQuery,
}));

jest.unstable_mockModule('../../api/progress', () => mockProgressApi);

describe('useProgress hooks', () => {
  let useProgressHooks;

  beforeEach(async () => {
    jest.clearAllMocks();
    useProgressHooks = await import('../../hooks/useProgress');
  });

  describe('useProgressReport', () => {
    it('should configure query correctly with timeRange only', () => {
      useProgressHooks.useProgressReport('7d');

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['progress-report', '7d', null],
        staleTime: 60000,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockProgressApi.fetchProgressReport).toHaveBeenCalledWith('7d', null);
    });

    it('should configure query correctly with timeRange and courseId', () => {
      useProgressHooks.useProgressReport('30d', '123');

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['progress-report', '30d', '123'],
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockProgressApi.fetchProgressReport).toHaveBeenCalledWith('30d', '123');
    });

    it('should use select to transform data correctly', () => {
      useProgressHooks.useProgressReport('all');

      const { select } = mockUseQuery.mock.calls[0][0];

      // Test with data
      const result = select({
        data: {
          summary: { total: 10 },
          timeline: [1, 2],
          recentActivity: [3, 4]
        }
      });
      expect(result).toEqual({
        summary: { total: 10 },
        timeline: [1, 2],
        recentActivity: [3, 4]
      });

      // Test without data
      const emptyResult = select({});
      expect(emptyResult).toEqual({
        summary: {},
        timeline: [],
        recentActivity: []
      });
    });
  });
});
