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
const mockAdminApi = {
  getUsers: jest.fn(),
  searchUsers: jest.fn(),
  getUserDetails: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQueryClient: mockUseQueryClient,
  useMutation: mockUseMutation,
  useQuery: mockUseQuery,
}));

jest.unstable_mockModule('../../api/admin', () => mockAdminApi);

describe('useUserManagement hooks', () => {
  let useUserManagementHooks;

  beforeEach(async () => {
    jest.clearAllMocks();
    useUserManagementHooks = await import('../../hooks/useUserManagement');
  });

  describe('useUsers', () => {
    it('should configure query correctly with default params', () => {
      useUserManagementHooks.useUsers();

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['users', 1, 20],
        staleTime: 30000,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockAdminApi.getUsers).toHaveBeenCalledWith(1, 20);
    });

    it('should configure query correctly with custom params', () => {
      useUserManagementHooks.useUsers(2, 50);

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['users', 2, 50],
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockAdminApi.getUsers).toHaveBeenCalledWith(2, 50);
    });
  });

  describe('useSearchUsers', () => {
    it('should configure query correctly with query', () => {
      useUserManagementHooks.useSearchUsers('john');

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['users', 'search', 'john'],
        enabled: true,
        staleTime: 10000,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockAdminApi.searchUsers).toHaveBeenCalledWith('john');
    });

    it('should disable query when no query', () => {
      useUserManagementHooks.useSearchUsers(null);

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });

    it('should disable query when empty query', () => {
      useUserManagementHooks.useSearchUsers('');

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });
  });

  describe('useUserDetails', () => {
    it('should configure query correctly with userId', () => {
      useUserManagementHooks.useUserDetails('user123');

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['user', 'user123'],
        enabled: true,
        staleTime: 30000,
      }));

      // Test queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockAdminApi.getUserDetails).toHaveBeenCalledWith('user123');
    });

    it('should disable query when no userId', () => {
      useUserManagementHooks.useUserDetails(null);

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });
  });

  describe('useUpdateUser', () => {
    it('should configure mutation correctly', () => {
      useUserManagementHooks.useUpdateUser();

      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        onSuccess: expect.any(Function),
      }));

      // Test mutationFn
      const { mutationFn } = mockUseMutation.mock.calls[0][0];
      const params = { userId: 'user123', userData: { name: 'John' } };
      mutationFn(params);
      expect(mockAdminApi.updateUser).toHaveBeenCalledWith('user123', { name: 'John' });

      // Test onSuccess
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      onSuccess(null, params);
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['user', 'user123']
      });
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['users']
      });
    });
  });

  describe('useDeleteUser', () => {
    it('should configure mutation correctly', () => {
      useUserManagementHooks.useDeleteUser();

      expect(mockUseMutation).toHaveBeenCalled();

      // Test mutationFn
      const { mutationFn } = mockUseMutation.mock.calls[0][0];
      mutationFn('user123');
      expect(mockAdminApi.deleteUser).toHaveBeenCalledWith('user123');

      // Test onSuccess
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      onSuccess();
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['users']
      });
    });
  });
});
