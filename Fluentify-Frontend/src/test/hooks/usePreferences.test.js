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
const mockPreferencesApi = {
  getLearnerPreferences: jest.fn(),
  saveLearnerPreferences: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQueryClient: mockUseQueryClient,
  useMutation: mockUseMutation,
  useQuery: mockUseQuery,
}));

jest.unstable_mockModule('../../api/preferences', () => mockPreferencesApi);

describe('usePreferences hooks', () => {
  let usePreferencesHooks;

  beforeEach(async () => {
    jest.clearAllMocks();
    usePreferencesHooks = await import('../../hooks/usePreferences');
  });

  describe('useLearnerPreferences', () => {
    it('should configure query correctly', () => {
      usePreferencesHooks.useLearnerPreferences();

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['preferences', 'learner'],
        queryFn: mockPreferencesApi.getLearnerPreferences,
        retry: false,
      }));
    });
  });

  describe('useSaveLearnerPreferences', () => {
    it('should configure mutation correctly', () => {
      usePreferencesHooks.useSaveLearnerPreferences();

      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockPreferencesApi.saveLearnerPreferences,
      }));

      // Test onSuccess
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      onSuccess();
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['preferences', 'learner']
      });
    });
  });
});
