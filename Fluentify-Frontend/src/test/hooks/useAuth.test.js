/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mocks
const mockNavigate = jest.fn();
const mockQueryClient = {
  invalidateQueries: jest.fn(),
  clear: jest.fn(),
};
const mockUseQueryClient = jest.fn(() => mockQueryClient);
const mockUseMutation = jest.fn();
const mockUseQuery = jest.fn();

// API Mocks
const mockAuthApi = {
  loginUser: jest.fn(),
  signupUser: jest.fn(),
  verifySignupOTP: jest.fn(),
  forgotPassword: jest.fn(),
  verifyResetOTP: jest.fn(),
  resetPassword: jest.fn(),
  resendOTP: jest.fn(),
  getPasswordSuggestions: jest.fn(),
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  logoutUser: jest.fn(),
};

// Mock modules
jest.unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQueryClient: mockUseQueryClient,
  useMutation: mockUseMutation,
  useQuery: mockUseQuery,
}));

jest.unstable_mockModule('../../api/auth', () => mockAuthApi);

describe('useAuth hooks', () => {
  let useAuth;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock localStorage
    const localStorageMock = (function () {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    useAuth = await import('../../hooks/useAuth');
  });

  describe('useLogin', () => {
    it('should configure mutation correctly', () => {
      useAuth.useLogin();

      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockAuthApi.loginUser,
      }));
    });

    it('should handle onSuccess correctly', () => {
      useAuth.useLogin();
      const { onSuccess } = mockUseMutation.mock.calls[0][0];

      const mockData = { data: { token: 'new-token' } };
      onSuccess(mockData);

      expect(localStorage.setItem).toHaveBeenCalledWith('jwt', 'new-token');
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    });

    it('should not set token if not present in response', () => {
      useAuth.useLogin();
      const { onSuccess } = mockUseMutation.mock.calls[0][0];

      onSuccess({ data: {} });

      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    });
  });

  describe('useSignup', () => {
    it('should configure mutation correctly', () => {
      useAuth.useSignup();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockAuthApi.signupUser,
      }));
    });
  });

  describe('useVerifySignupOTP', () => {
    it('should configure mutation correctly', () => {
      useAuth.useVerifySignupOTP();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockAuthApi.verifySignupOTP,
      }));
    });

    it('should handle onSuccess correctly', () => {
      useAuth.useVerifySignupOTP();
      const { onSuccess } = mockUseMutation.mock.calls[0][0];

      const mockData = { data: { token: 'otp-token' } };
      onSuccess(mockData);

      expect(localStorage.setItem).toHaveBeenCalledWith('jwt', 'otp-token');
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    });

    it('should not set token if not present', () => {
      useAuth.useVerifySignupOTP();
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      onSuccess({ data: {} });
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('useUserProfile', () => {
    it('should configure query correctly', () => {
      localStorage.setItem('jwt', 'test-token');
      useAuth.useUserProfile();

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['user', 'profile'],
        enabled: true,
        retry: false,
        staleTime: 30000,
      }));

      // Test the queryFn
      const { queryFn } = mockUseQuery.mock.calls[0][0];
      queryFn();
      expect(mockAuthApi.getUserProfile).toHaveBeenCalledWith('test-token');
    });

    it('should disable query if no token', () => {
      localStorage.removeItem('jwt');
      useAuth.useUserProfile();

      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        enabled: false,
      }));
    });
  });

  describe('useLogout', () => {
    it('should perform logout actions', () => {
      const logout = useAuth.useLogout();
      logout();

      expect(mockAuthApi.logoutUser).toHaveBeenCalled();
      expect(mockQueryClient.clear).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('useIsAuthenticated', () => {
    it('should return false if no token', () => {
      localStorage.removeItem('jwt');
      expect(useAuth.useIsAuthenticated()).toBe(false);
    });

    it('should return false if token is invalid', () => {
      localStorage.setItem('jwt', 'invalid-token');
      expect(useAuth.useIsAuthenticated()).toBe(false);
    });

    it('should return false if token is expired', () => {
      // Create expired token
      const payload = { exp: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('jwt', token);

      expect(useAuth.useIsAuthenticated()).toBe(false);
    });

    it('should return true if token is valid', () => {
      // Create valid token
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour future
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorage.setItem('jwt', token);

      expect(useAuth.useIsAuthenticated()).toBe(true);
    });
  });

  describe('useForgotPassword', () => {
    it('should configure mutation correctly', () => {
      useAuth.useForgotPassword();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockAuthApi.forgotPassword,
      }));
    });
  });

  describe('useVerifyResetOTP', () => {
    it('should configure mutation correctly', () => {
      useAuth.useVerifyResetOTP();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockAuthApi.verifyResetOTP,
      }));
    });
  });

  describe('useResetPassword', () => {
    it('should configure mutation correctly', () => {
      useAuth.useResetPassword();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockAuthApi.resetPassword,
      }));
    });
  });

  describe('useResendOTP', () => {
    it('should configure mutation correctly', () => {
      useAuth.useResendOTP();
      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        mutationFn: mockAuthApi.resendOTP,
      }));
    });
  });

  describe('usePasswordSuggestions', () => {
    it('should configure query correctly', () => {
      useAuth.usePasswordSuggestions();
      expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['password-suggestions'],
        queryFn: mockAuthApi.getPasswordSuggestions,
        enabled: false,
        staleTime: Infinity,
      }));
    });
  });

  describe('useUpdateProfile', () => {
    it('should configure mutation correctly', () => {
      localStorage.setItem('jwt', 'test-token');
      useAuth.useUpdateProfile();

      expect(mockUseMutation).toHaveBeenCalledWith(expect.objectContaining({
        onSuccess: expect.any(Function),
      }));

      // Test mutationFn
      const { mutationFn } = mockUseMutation.mock.calls[0][0];
      const updates = { name: 'New Name' };
      mutationFn(updates);
      expect(mockAuthApi.updateUserProfile).toHaveBeenCalledWith('test-token', updates);

      // Test onSuccess
      const { onSuccess } = mockUseMutation.mock.calls[0][0];
      onSuccess();
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['user', 'profile'] });
    });
  });
});
