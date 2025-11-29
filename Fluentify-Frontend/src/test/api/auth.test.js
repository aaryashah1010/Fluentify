import { jest } from '@jest/globals';

// ------------------------------
// Mocks
// ------------------------------

const mockHandleResponse = jest.fn(async (response) => ({ ok: true, response }));

await jest.unstable_mockModule('../../api/apiHelpers.js', () => ({
  API_BASE_URL: 'http://test-base',
  handleResponse: mockHandleResponse,
}));

// Import module under test AFTER mocks
const authApi = await import('../../api/auth.js');

const makeMockResponse = () => ({ ok: true });

describe('auth API client', () => {
  let originalLocalStorage;
  let removeItemMock;

  beforeAll(() => {
    originalLocalStorage = globalThis.localStorage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = jest.fn().mockResolvedValue(makeMockResponse());
    removeItemMock = jest.fn();
    const mockLocalStorage = {
      removeItem: removeItemMock,
      getItem: jest.fn(),
    };
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });
  });

  afterAll(() => {
    globalThis.localStorage = originalLocalStorage;
  });

  describe('loginUser', () => {
    it('posts credentials to role-specific login endpoint and delegates to handleResponse', async () => {
      const creds = { role: 'learner', email: 'test@example.com', password: 'pass' };

      await authApi.loginUser(creds);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/login/learner',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com', password: 'pass' }),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('signupUser', () => {
    it('posts signup data with role to signup endpoint', async () => {
      const creds = { role: 'admin', name: 'Admin', email: 'a@example.com', password: 'p' };

      await authApi.signupUser(creds);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/signup/admin',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Admin', email: 'a@example.com', password: 'p' }),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('verifySignupOTP', () => {
    it('posts verify payload including otp to verify endpoint', async () => {
      const data = { role: 'learner', name: 'N', email: 'e@example.com', password: 'p', otp: '123456' };

      await authApi.verifySignupOTP(data);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/signup/learner/verify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'N', email: 'e@example.com', password: 'p', otp: '123456' }),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('posts email and role to forgot-password endpoint', async () => {
      const data = { email: 'e@example.com', role: 'learner' };

      await authApi.forgotPassword(data);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('verifyResetOTP', () => {
    it('posts reset OTP payload to verify-reset-otp endpoint', async () => {
      const data = { email: 'e@example.com', otp: '999999', role: 'learner' };

      await authApi.verifyResetOTP(data);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/verify-reset-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('posts reset password payload to reset-password endpoint', async () => {
      const data = {
        email: 'e@example.com',
        otp: '111111',
        newPassword: 'new',
        confirmPassword: 'new',
        role: 'learner',
      };

      await authApi.resetPassword(data);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('resendOTP', () => {
    it('posts resend OTP payload to resend-otp endpoint', async () => {
      const data = { email: 'e@example.com', otpType: 'signup', role: 'learner', name: 'N' };

      await authApi.resendOTP(data);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/resend-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('getPasswordSuggestions', () => {
    it('requests password suggestions with GET', async () => {
      await authApi.getPasswordSuggestions();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/password-suggestions',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('getUserProfile', () => {
    it('sends GET with bearer token header to profile endpoint', async () => {
      await authApi.getUserProfile('token-123');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/profile',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer token-123',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('updateUserProfile', () => {
    it('sends PUT with bearer token header and updates body', async () => {
      const updates = { name: 'New Name', contest_name: 'Player1' };

      await authApi.updateUserProfile('token-xyz', updates);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://test-base/api/auth/profile',
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer token-xyz',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalled();
    });
  });

  describe('logoutUser', () => {
    it('removes jwt from localStorage', () => {
      authApi.logoutUser();
      expect(removeItemMock).toHaveBeenCalledWith('jwt');
    });
  });
});
