import { jest } from '@jest/globals';

// --- ESM-safe mocks BEFORE importing the controller ---
// bcrypt
const mockBcrypt = {
  hash: jest.fn(async (pw) => `hashed:${pw}`),
  compare: jest.fn(async (pw, hash) => hash === `hashed:${pw}`),
};
await jest.unstable_mockModule('../../utils/jwt.js', () => {
  // capture the mock so tests can assert calls/args (detect mutations that change payloads)
  const mockCreateAuthToken = jest.fn().mockReturnValue('mock.jwt.token');
  return { createAuthToken: mockCreateAuthToken };
});
await jest.unstable_mockModule('bcrypt', () => ({ default: mockBcrypt }));

// response utils
const mockSuccessResponse = jest.fn((data, message) => ({ success: true, data, message }));
const mockAuthResponse = jest.fn((data, message) => ({ success: true, data, message }));
await jest.unstable_mockModule('../../utils/response.js', () => ({
  successResponse: mockSuccessResponse,
  authResponse: mockAuthResponse,
}));

// validation utils
const mockValidateName = jest.fn((n) => ({ isValid: !!n && n.trim().length >= 2, errors: !!n && n.trim().length >= 2 ? [] : ['Name is invalid'] }));
const mockValidateEmail = jest.fn((e) => ({ isValid: /@/.test(e || ''), errors: /@/.test(e || '') ? [] : ['Invalid email format'] }));
const mockValidatePassword = jest.fn(() => ({ isValid: true, errors: [] }));
const mockValidateOTP = jest.fn((otp) => ({ isValid: /^\d{6}$/.test(otp || ''), errors: /^\d{6}$/.test(otp || '') ? [] : ['OTP must be a 6-digit number'] }));
const mockGeneratePasswordSuggestions = jest.fn(() => ['Sugg1', 'Sugg2', 'Sugg3']);
await jest.unstable_mockModule('../../utils/validation.js', () => ({
  validateName: mockValidateName,
  validateEmail: mockValidateEmail,
  validatePassword: mockValidatePassword,
  validateOTP: mockValidateOTP,
  generatePasswordSuggestions: mockGeneratePasswordSuggestions,
}));

// email service
const mockEmailService = {
  generateOTP: jest.fn(() => '123456'),
  sendSignupOTP: jest.fn(async () => ({ success: true })),
  sendWelcomeEmail: jest.fn(async () => ({ success: true })),
  sendPasswordResetOTP: jest.fn(async () => ({ success: true })),
  sendProfileUpdateConfirmation: jest.fn(async () => ({ success: true })),
};
await jest.unstable_mockModule('../../utils/emailService.js', () => ({ default: mockEmailService }));

// repository
const mockAuthRepository = {
  findLearnerByEmail: jest.fn(),
  findAdminByEmail: jest.fn(),
  storeOTP: jest.fn(async () => {}),
  verifyOTP: jest.fn(),
  beginTransaction: jest.fn(async () => {}),
  commitTransaction: jest.fn(async () => {}),
  rollbackTransaction: jest.fn(async () => {}),
  createLearner: jest.fn(async (n, e, h) => ({ id: 1, name: n, email: e })),
  markLearnerEmailVerified: jest.fn(async () => {}),
  markAdminEmailVerified: jest.fn(async () => {}),
  markOTPAsUsed: jest.fn(async () => {}),
  createAdmin: jest.fn(async (n, e, h) => ({ id: 10, name: n, email: e })),
  getFullLearnerProfile: jest.fn(),
  getFullAdminProfile: jest.fn(),
  updateLearnerProfile: jest.fn(),
  updateAdminProfile: jest.fn(),
  updateLearnerPassword: jest.fn(async () => {}),
  updateAdminPassword: jest.fn(async () => {}),
  deleteOTPsByEmail: jest.fn(async () => {}),
  getLatestOTP: jest.fn(),
};
await jest.unstable_mockModule('../../repositories/authRepository.js', () => ({ default: mockAuthRepository }));

// Import after mocks
const { ERRORS } = await import('../../utils/error.js');
// re-import the mock createAuthToken so tests below can read it
const { createAuthToken: mockCreateAuthTokenImported } = await import('../../utils/jwt.js');
const mockCreateAuthToken = mockCreateAuthTokenImported;
const authController = (await import('../../controllers/authController.js')).default;

function resMock() {
  return {
    statusCode: 200,
    status: jest.fn(function (code) { this.statusCode = code; return this; }),
    json: jest.fn(),
  };
}
const nextMock = () => jest.fn();

describe('authController', () => {
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

  // --- Signup Learner ---
  describe('signupLearner', () => {
    it('validates and sends OTP successfully', async () => {
      const req = { body: { name: 'John Doe', email: 'john@mail.com', password: 'GoodPass1!' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);

      await authController.signupLearner(req, res, next);

      // repository/email interactions
      expect(mockAuthRepository.findLearnerByEmail).toHaveBeenCalledWith('john@mail.com');
      expect(mockEmailService.sendSignupOTP).toHaveBeenCalledWith('john@mail.com', 'John Doe', '123456');
      // OTP storage must be called with exact type/context
      expect(mockAuthRepository.storeOTP).toHaveBeenCalledWith('john@mail.com', '123456', 'signup', 'learner');

      // successResponse should be called with the correct data and message
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { email: 'john@mail.com', message: 'OTP sent to your email' },
        'Please verify your email with the OTP sent',
      );

      // Final JSON payload
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { email: 'john@mail.com', message: 'OTP sent to your email' },
        message: 'Please verify your email with the OTP sent',
      });

      // No errors should be logged on happy path
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('loginLearner missing fields throws', async () => {
      const req = { body: { email: '', password: '' } };
      const res = resMock();
      const next = nextMock();
      await authController.loginLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('loginLearner email not registered throws', async () => {
      const req = { body: { email: 'e@mail.com', password: 'p' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);
      await authController.loginLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_NOT_REGISTERED_LEARNER);
    });

    it('returns 400 when name invalid', async () => {
      const req = { body: { name: 'J', email: 'john@mail.com', password: 'pass' } };
      const res = resMock();
      const next = nextMock();

      // Force multiple validation errors so that join(', ') is observable
      mockValidateName.mockReturnValueOnce({ isValid: false, errors: ['too short', 'invalid chars'] });

      await authController.signupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'too short, invalid chars',
      });
      // Repository lookups should not be hit when validation fails
      expect(mockAuthRepository.findLearnerByEmail).not.toHaveBeenCalled();
    });

    it('throws EMAIL_ALREADY_EXISTS when user exists (and logs error)', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1 });

      await authController.signupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_ALREADY_EXISTS);

      // ensure the catch logged the error with the expected prefix (mutation would change this)
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error in learner signup:'), expect.anything());
    });

    it('returns 400 when email invalid', async () => {
      const req = { body: { name: 'John', email: 'bad', password: 'Good' } };
      const res = resMock();
      const next = nextMock();

      mockValidateEmail.mockReturnValueOnce({ isValid: false, errors: ['missing @', 'bad domain'] });
      await authController.signupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'missing @, bad domain',
      });
      expect(mockAuthRepository.findLearnerByEmail).not.toHaveBeenCalled();
    });

    it('returns 400 when password invalid (with suggestions)', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'weak' } };
      const res = resMock();
      const next = nextMock();
      mockValidatePassword.mockReturnValueOnce({ isValid: false, errors: ['too short', 'no number'] });
      await authController.signupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'too short, no number',
        suggestions: ['Sugg1', 'Sugg2', 'Sugg3'],
      });
      expect(mockAuthRepository.findLearnerByEmail).not.toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when body missing fields', async () => {
      const req = { body: { name: '', email: '', password: '' } };
      const res = resMock();
      const next = nextMock();
      await authController.signupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('throws MISSING_REQUIRED_FIELDS when only name missing', async () => {
      const req = { body: { name: '', email: 'john@mail.com', password: 'GoodPass1!' } };
      const res = resMock(); const next = nextMock();

      await authController.signupLearner(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when only email missing', async () => {
      const req = { body: { name: 'John', email: '', password: 'GoodPass1!' } };
      const res = resMock(); const next = nextMock();

      await authController.signupLearner(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when only password missing', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: '' } };
      const res = resMock(); const next = nextMock();

      await authController.signupLearner(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when body missing fields (admin)', async () => {
      const req = { body: { name: '', email: '', password: '' } };
      const res = resMock();
      const next = nextMock();
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('throws USER_NOT_FOUND when learner update returns null', async () => {
      const req = { user: { id: 3, role: 'learner' }, body: { name: 'NewN' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.updateLearnerProfile.mockResolvedValueOnce(null);
      await authController.updateProfile(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.USER_NOT_FOUND);
    });

    it('handles email service rejection without failing response', async () => {
      const req = { user: { id: 4, role: 'learner' }, body: { name: 'Ok' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.updateLearnerProfile.mockResolvedValueOnce({ id: 4, name: 'Ok', email: 'e@mail.com' });
      mockEmailService.sendProfileUpdateConfirmation.mockRejectedValueOnce(new Error('mail down'));
      await authController.updateProfile(req, res, next);
      expect(res.json).toHaveBeenCalled();
      // ensure non-blocking rejection did not call next
      expect(next).not.toHaveBeenCalled();

      // error was logged from the background promise
      await new Promise((r) => setImmediate(r));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to send profile update confirmation:'), expect.anything());
    });
  });

  // ===== Targeted tests for specific uncovered lines =====
  describe('targeted branches', () => {
    it('verifySignupAdmin: welcome email rejection is caught (line ~276)', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', otp: '123456', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 1 });
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);
      mockEmailService.sendWelcomeEmail.mockRejectedValueOnce(new Error('mail fail'));
      await authController.verifySignupAdmin(req, res, next);
      expect(res.json).toHaveBeenCalled();
      // welcome email rejected — ensure controller logged the error (didn't crash)
      await new Promise((r) => setImmediate(r));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to send welcome email:'), expect.anything());
    });

    it('forgotPassword: missing required fields throws (line ~510)', async () => {
      const req = { body: { email: '', role: '' } };
      const res = resMock(); const next = nextMock();
      await authController.forgotPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('forgotPassword: storeOTP failure hits catch and calls next (lines ~564-565)', async () => {
      const req = { body: { email: 'e@mail.com', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      // valid email and existing verified user
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N', is_email_verified: true });
      // make storeOTP throw
      mockAuthRepository.storeOTP.mockRejectedValueOnce(new Error('store fail'));
      await authController.forgotPassword(req, res, next);
      expect(next).toHaveBeenCalled();
      // make sure error contains fragment logged by controller
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error in forgot password:'), expect.anything());
    });

    it('forgotPassword: missing email but role present throws', async () => {
      const req = { body: { email: '', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      await authController.forgotPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('resendOTP: missing required fields -> catch returns 500 (line ~695)', async () => {
      const req = { body: { email: '', otpType: '', role: '' } };
      const res = resMock(); const next = nextMock();
      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);

      // make response shape explicit to catch mutants that return {} or different text
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to resend OTP. Please try again.',
      });

      // ensure error logging occurred with expected fragment
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error in resend OTP:'), expect.anything());
    });

    it('getPasswordSuggestions: generate throws -> catch next (lines ~793-794)', async () => {
      const req = {}; const res = resMock(); const next = nextMock();
      // Force throw
      mockGeneratePasswordSuggestions.mockImplementationOnce(() => { throw new Error('gen fail'); });
      await authController.getPasswordSuggestions(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error generating password suggestions:'), expect.anything());
    });
  });

  // --- verifySignupLearner ---
  describe('verifySignupLearner', () => {
    it('completes signup and commits transaction', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock();
      const next = nextMock();

      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 99 });
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);

      await authController.verifySignupLearner(req, res, next);

      expect(mockAuthRepository.beginTransaction).toHaveBeenCalled();
      expect(mockAuthRepository.commitTransaction).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();

      // ensure verifyOTP was called with exact signup args
      expect(mockAuthRepository.verifyOTP).toHaveBeenCalledWith('john@mail.com', '123456', 'signup', 'learner');
      // ensure learner creation happened with expected params
      expect(mockAuthRepository.createLearner).toHaveBeenCalledWith('John', 'john@mail.com', expect.any(String));

      // authResponse should contain token and user with email and verification flag
      expect(mockAuthResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            email: 'john@mail.com',
            id: expect.any(Number),
            isEmailVerified: true,
          }),
          token: 'mock.jwt.token',
        }),
        'Signup successful'
      );

      // ensure createAuthToken called with the payload that includes role & hasPreferences false
      expect(mockCreateAuthToken).toHaveBeenCalledWith(expect.objectContaining({
        email: 'john@mail.com',
        role: 'learner',
        hasPreferences: false,
      }));
    });

    it('returns 400 when OTP record not found (invalid or expired)', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock();
      const next = nextMock();

      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);

      await authController.verifySignupLearner(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      // Exact message must be present — mutants that blank this will fail
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired OTP',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('throws EMAIL_ALREADY_EXISTS when learner exists after OTP', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 42 });
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1 });
      await authController.verifySignupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_ALREADY_EXISTS);
    });

    it('handles welcome email rejection without failing learner signup response', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 7 });
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);
      mockEmailService.sendWelcomeEmail.mockRejectedValueOnce(new Error('welcome fail'));

      await authController.verifySignupLearner(req, res, next);
      // allow microtasks for the rejected promise catch
      await new Promise((r) => setImmediate(r));

      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      // make sure error logging includes the welcome email failure message
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to send welcome email:'), expect.anything());
    });

    it('rolls back on inner error', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 99 });
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);
      mockAuthRepository.createLearner.mockRejectedValueOnce(new Error('create fail'));

      await authController.verifySignupLearner(req, res, next);

      expect(mockAuthRepository.rollbackTransaction).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      // make sure rollback path logs a specific message fragment
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error in learner signup verification:'), expect.anything());
    });

    it('returns 400 when OTP invalid format', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '12' } };
      const res = resMock(); const next = nextMock();

      // Multiple errors so join(', ') vs join('') is observable
      mockValidateOTP.mockReturnValueOnce({ isValid: false, errors: ['too short', 'not numeric'] });

      await authController.verifySignupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'too short, not numeric',
      });
      expect(mockAuthRepository.verifyOTP).not.toHaveBeenCalled();
    });

    // NEW: covers several conditional/logical mutants around missing-field checks
    it('throws MISSING_REQUIRED_FIELDS when otp missing but other fields present', async () => {
      // This fails if the condition was changed to only check otp in isolation or combined incorrectly
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '' } };
      const res = resMock(); const next = nextMock();
      await authController.verifySignupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('throws MISSING_REQUIRED_FIELDS when name missing but otp present', async () => {
      // Ensure condition checks other fields as well, not just otp
      const req = { body: { name: '', email: 'john@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock(); const next = nextMock();
      await authController.verifySignupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });
  });

  // --- signupAdmin / verifySignupAdmin ---
  describe('signupAdmin', () => {
    it('sends OTP when admin does not exist', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', adminPassKey: '12345' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);

      await authController.signupAdmin(req, res, next);

      // email send & OTP persisted with exact values
      expect(mockEmailService.sendSignupOTP).toHaveBeenCalledWith('a@mail.com', 'Admin', '123456');
      expect(mockAuthRepository.storeOTP).toHaveBeenCalledWith('a@mail.com', '123456', 'signup', 'admin');

      // response shape exact
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { email: 'a@mail.com', message: 'OTP sent to your email' },
        'Please verify your email with the OTP sent',
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('returns 403 when adminPassKey is invalid', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', adminPassKey: 'wrong' } };
      const res = resMock();
      const next = nextMock();

      await authController.signupAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      // when adminPassKey invalid the JSON and message should be explicit
      const call = res.json.mock.calls[0][0];
      expect(call).toEqual({ success: false, message: 'Invalid admin pass key' });
    });

    it('returns 400 when admin name invalid (ensures joined message)', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good', adminPassKey: '12345' } };
      const res = resMock();
      const next = nextMock();
      mockValidateName.mockReturnValueOnce({ isValid: false, errors: ['too short', 'invalid chars'] });

      await authController.signupAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'too short, invalid chars' });
      expect(mockAuthRepository.findAdminByEmail).not.toHaveBeenCalled();
    });

    it('returns 400 when admin email invalid (ensures joined message)', async () => {
      const req = { body: { name: 'Admin', email: 'bad', password: 'Good', adminPassKey: '12345' } };
      const res = resMock();
      const next = nextMock();
      mockValidateEmail.mockReturnValueOnce({ isValid: false, errors: ['missing @', 'bad domain'] });

      await authController.signupAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'missing @, bad domain' });
      expect(mockAuthRepository.findAdminByEmail).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when admin password invalid (ensures joined message with suggestions)', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'weak', adminPassKey: '12345' } };
      const res = resMock();
      const next = nextMock();
      mockValidatePassword.mockReturnValueOnce({ isValid: false, errors: ['too short', 'needs symbol'] });

      await authController.signupAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'too short, needs symbol',
        suggestions: ['Sugg1', 'Sugg2', 'Sugg3'],
      });
      expect(mockAuthRepository.findAdminByEmail).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('throws EMAIL_ALREADY_EXISTS when admin exists (and logs error)', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 10 });
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_ALREADY_EXISTS);

      // ensure admin signup error logging maintained
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error in admin signup:'), expect.anything());
    });

    // NEW: ensure missing adminPassKey triggers MISSING_REQUIRED_FIELDS (targets conditional mutation)
    it('throws MISSING_REQUIRED_FIELDS when adminPassKey missing but other fields present', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', adminPassKey: '' } };
      const res = resMock(); const next = nextMock();
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('throws MISSING_REQUIRED_FIELDS when name missing but other fields present', async () => {
      const req = { body: { name: '', email: 'a@mail.com', password: 'Good', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when email missing but other fields present', async () => {
      const req = { body: { name: 'Admin', email: '', password: 'Good', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when password missing but other fields present', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: '', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('verifySignupAdmin', () => {
    it('verifies OTP and creates admin', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', otp: '123456', adminPassKey: '12345' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 5 });
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);

      await authController.verifySignupAdmin(req, res, next);

      expect(mockAuthRepository.verifyOTP).toHaveBeenCalledWith('a@mail.com', '123456', 'signup', 'admin');
      expect(mockAuthRepository.createAdmin).toHaveBeenCalledWith('Admin', 'a@mail.com', expect.any(String));
      expect(mockAuthResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({ email: 'a@mail.com', id: expect.any(Number), isEmailVerified: true }),
          token: 'mock.jwt.token',
        }),
        'Admin signup successful'
      );
      expect(res.json).toHaveBeenCalled();

      // ensure createAuthToken called with admin role
      expect(mockCreateAuthToken).toHaveBeenCalledWith(expect.objectContaining({
        email: 'a@mail.com',
        role: 'admin',
      }));
    });

    it('returns 403 when adminPassKey is invalid during verification', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', otp: '123456', adminPassKey: 'wrong' } };
      const res = resMock();
      const next = nextMock();

      await authController.verifySignupAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      // ensure JSON contains the explicit message
      expect(res.json.mock.calls[0][0]).toEqual({ success: false, message: 'Invalid admin pass key' });
    });
  });

  // --- loginLearner / loginAdmin ---
  describe('login', () => {
    it('loginLearner success', async () => {
      const req = { body: { email: 'e@mail.com', password: 'p' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 2, email: 'e@mail.com', name: 'E', password_hash: 'hashed:p', has_preferences: true });

      await authController.loginLearner(req, res, next);
      // ensure authResponse was used and returned payload contains token and user info
      expect(mockAuthResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({ email: 'e@mail.com', id: 2 }),
          token: 'mock.jwt.token',
        }),
        'Login successful'
      );
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ token: 'mock.jwt.token' }),
      }));

      // ensure token creation payload contains the learner role and hasPreferences mapped
      expect(mockCreateAuthToken).toHaveBeenCalledWith(expect.objectContaining({
        id: 2,
        email: 'e@mail.com',
        role: 'learner',
        hasPreferences: true,
      }));
    });

    it('loginLearner incorrect password', async () => {
      const req = { body: { email: 'e@mail.com', password: 'wrong' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 2, email: 'e@mail.com', name: 'E', password_hash: 'hashed:p' });

      await authController.loginLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.INCORRECT_PASSWORD);
    });

    it('loginAdmin email not registered', async () => {
      const req = { body: { email: 'a@mail.com', password: 'p' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);

      await authController.loginAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_NOT_REGISTERED_ADMIN);
    });

    it('loginAdmin success', async () => {
      const req = { body: { email: 'a@mail.com', password: 'p' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 10, email: 'a@mail.com', name: 'A', password_hash: 'hashed:p' });

      await authController.loginAdmin(req, res, next);
      expect(mockAuthResponse).toHaveBeenCalledWith(
        { user: { id: 10, name: 'A', email: 'a@mail.com' }, token: 'mock.jwt.token' },
        'Admin login successful'
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: { id: 10, name: 'A', email: 'a@mail.com' }, token: 'mock.jwt.token' },
        message: 'Admin login successful',
      });

      // ensure token creation payload contains the admin role
      expect(mockCreateAuthToken).toHaveBeenCalledWith(expect.objectContaining({
        id: 10,
        email: 'a@mail.com',
        role: 'admin',
      }));
    });

    it('loginLearner missing password only throws MISSING_REQUIRED_FIELDS', async () => {
      const req = { body: { email: 'e@mail.com', password: '' } };
      const res = resMock();
      const next = nextMock();

      await authController.loginLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('loginAdmin missing password only throws MISSING_REQUIRED_FIELDS', async () => {
      const req = { body: { email: 'a@mail.com', password: '' } };
      const res = resMock();
      const next = nextMock();

      await authController.loginAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });
  });

  // --- getProfile ---
  describe('getProfile', () => {
    it('returns learner profile', async () => {
      const req = { user: { id: 1, role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.getFullLearnerProfile.mockResolvedValueOnce({ id: 1, name: 'N' });

      await authController.getProfile(req, res, next);
      expect(mockSuccessResponse).toHaveBeenCalledWith({ user: { id: 1, name: 'N' } }, 'Profile retrieved successfully');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: { id: 1, name: 'N' } },
        message: 'Profile retrieved successfully',
      });
    });

    it('invalid role throws', async () => {
      const req = { user: { id: 1, role: 'unknown' } };
      const res = resMock();
      const next = nextMock();

      await authController.getProfile(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.INVALID_AUTH_TOKEN);
    });
  });

  // --- updateProfile ---
  describe('updateProfile', () => {
    it('rejects empty body', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: {} };
      const res = resMock();
      const next = nextMock();

      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      // exact message check
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'At least one field (name or contest_name) is required',
      });
    });

    it('learner updates both fields and sends email (non-blocking)', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { name: 'New Name', contest_name: 'Contest' } };
      const res = resMock();
      const next = nextMock();
      const updated = { id: 1, name: 'New Name', email: 'e@mail.com' };
      mockAuthRepository.updateLearnerProfile.mockResolvedValueOnce(updated);

      await authController.updateProfile(req, res, next);
      expect(mockAuthRepository.updateLearnerProfile).toHaveBeenCalled();
      expect(mockSuccessResponse).toHaveBeenCalledWith({ user: updated }, 'Profile updated successfully');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: updated },
        message: 'Profile updated successfully',
      });

      // ensure profile-update confirmation email attempted and storeOTP not used here
      await new Promise((r) => setImmediate(r));
      expect(mockEmailService.sendProfileUpdateConfirmation).toHaveBeenCalledWith(updated.email, expect.any(String));
    });

    it('admin with contest_name returns 400', async () => {
      const req = { user: { id: 2, role: 'admin' }, body: { contest_name: 'x' } };
      const res = resMock();
      const next = nextMock();

      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Contest name is only available for learners',
      });
    });

    it('admin updates name', async () => {
      const req = { user: { id: 2, role: 'admin' }, body: { name: 'Boss' } };
      const res = resMock();
      const next = nextMock();
      const updated = { id: 2, name: 'Boss', email: 'a@mail.com' };
      mockAuthRepository.updateAdminProfile.mockResolvedValueOnce(updated);

      await authController.updateProfile(req, res, next);
      expect(mockAuthRepository.updateAdminProfile).toHaveBeenCalledWith(2, 'Boss');
      expect(mockSuccessResponse).toHaveBeenCalledWith({ user: updated }, 'Profile updated successfully');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: updated },
        message: 'Profile updated successfully',
      });
    });

    // NEW: ensure name is trimmed before passing to repository (targets changed .trim() mutants)
    it('trims name before sending to repository (admin path)', async () => {
      const req = { user: { id: 2, role: 'admin' }, body: { name: '  Boss  ' } };
      const res = resMock();
      const next = nextMock();
      const updated = { id: 2, name: 'Boss', email: 'a@mail.com' };
      mockAuthRepository.updateAdminProfile.mockResolvedValueOnce(updated);

      await authController.updateProfile(req, res, next);
      // must have been trimmed
      expect(mockAuthRepository.updateAdminProfile).toHaveBeenCalledWith(2, 'Boss');
    });
  });

  // --- forgot password ---
  describe('forgotPassword', () => {
    it('rejects invalid email', async () => {
      const req = { body: { email: 'bad', role: 'learner' } };
      const res = resMock();
      const next = nextMock();

      await authController.forgotPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email format',
      });
    });

    it('returns 404 when no user', async () => {
      const req = { body: { email: 'e@mail.com', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);

      await authController.forgotPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: `No learner account found with this email. Please sign up first.`,
      });
    });

    it('rejects unverified user', async () => {
      const req = { body: { email: 'e@mail.com', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N', is_email_verified: false });

      await authController.forgotPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email not verified. Please complete signup verification first.',
      });
    });

    it('sends password reset OTP for verified user and logs sending', async () => {
      const req = { body: { email: 'e@mail.com', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N', is_email_verified: true });

      await authController.forgotPassword(req, res, next);
      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalledWith('e@mail.com', 'N', expect.any(String));
      // ensure OTP stored with exact params
      expect(mockAuthRepository.storeOTP).toHaveBeenCalledWith('e@mail.com', expect.any(String), 'password_reset', 'learner');

      // Check exact response
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { email: 'e@mail.com', message: 'OTP sent to your email' },
        'Password reset OTP sent successfully. Check your email.'
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { email: 'e@mail.com', message: 'OTP sent to your email' },
        message: 'Password reset OTP sent successfully. Check your email.',
      });

      // ensure the sending log was produced with the exact fragment (detect mutations that wipe the log)
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('🔐 Sending password reset OTP for learner: e@mail.com'));
    });

    it('returns 400 when invalid role specified', async () => {
      const req = { body: { email: 'e@mail.com', role: 'other' } };
      const res = resMock();
      const next = nextMock();

      await authController.forgotPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid role specified',
      });
    });

    it('sends password reset OTP for verified admin user', async () => {
      const req = { body: { email: 'admin@mail.com', role: 'admin' } };
      const res = resMock();
      const next = nextMock();

      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 5, name: 'Admin', is_email_verified: true });

      await authController.forgotPassword(req, res, next);

      expect(mockAuthRepository.findAdminByEmail).toHaveBeenCalledWith('admin@mail.com');
      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalledWith('admin@mail.com', 'Admin', expect.any(String));
      expect(mockAuthRepository.storeOTP).toHaveBeenCalledWith('admin@mail.com', expect.any(String), 'password_reset', 'admin');
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  // --- verifyResetOTP ---
  describe('verifyResetOTP', () => {
    it('validates and verifies OTP and returns exact success message', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 7 });

      await authController.verifyResetOTP(req, res, next);
      expect(res.json).toHaveBeenCalled();
      // verify that verifyOTP call used correct args
      expect(mockAuthRepository.verifyOTP).toHaveBeenCalledWith('e@mail.com', '123456', 'password_reset', 'learner');

      // ensure the success message is exact (mutation could replace it with empty string)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { email: 'e@mail.com', verified: true },
        message: 'OTP verified successfully',
      });
    });
  });

  // --- resetPassword ---
  describe('resetPassword', () => {
    it('rejects mismatched passwords', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: 'a', confirmPassword: 'b', role: 'learner' } };
      const res = resMock();
      const next = nextMock();

      await authController.resetPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Passwords do not match',
      });
    });

    it('validates and resets password for learner', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: 'newP', confirmPassword: 'newP', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N' });
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 8 });

      await authController.resetPassword(req, res, next);

      // verify correct OTP verification path called
      expect(mockAuthRepository.verifyOTP).toHaveBeenCalledWith('e@mail.com', '123456', 'password_reset', 'learner');

      // controller uses email for learner password update (observed behavior)
      expect(mockAuthRepository.updateLearnerPassword).toHaveBeenCalledWith('e@mail.com', expect.any(String));
      expect(mockAuthRepository.deleteOTPsByEmail).toHaveBeenCalledWith('e@mail.com', 'password_reset', 'learner');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { message: 'Password reset successful' },
        message: 'Your password has been reset successfully',
      });
    });
  });

  // --- resendOTP ---
  describe('resendOTP', () => {
    it('enforces cooldown when recent OTP exists', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'e@mail.com', otpType: 'signup', role: 'learner', name: 'N' } };
      const res = resMock();
      const next = nextMock();
      // latest OTP created 30 seconds ago while cooldown is e.g. 60s
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce({ created_at: new Date(now - 30 * 1000).toISOString() });

      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(429);
      // assert exact message structure that the controller produces
      const call = res.json.mock.calls[0][0];
      // require the "Please wait Xs before requesting a new OTP." format and ensure X is a number
      expect(call).toEqual({
        success: false,
        message: expect.stringMatching(/^Please wait \d+s before requesting a new OTP\.$/),
      });
      Date.now.mockRestore();
    });

    it('resends signup OTP when no cooldown', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'e@mail.com', otpType: 'signup', role: 'learner', name: 'N' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce(null);

      await authController.resendOTP(req, res, next);

      // exact email send call
      expect(mockEmailService.sendSignupOTP).toHaveBeenCalledWith('e@mail.com', 'N', expect.any(String));
      // ensure OTP stored with exact type and role
      expect(mockAuthRepository.storeOTP).toHaveBeenCalledWith('e@mail.com', expect.any(String), 'signup', 'learner');

      // ensure controller logs the resending and success messages (these were being mutated)
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(`🔄 Resending signup OTP to: e@mail.com`));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(`✅ OTP resent successfully to: e@mail.com`));

      // allow controller implementations that either include or omit the email field
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'OTP resent successfully' }),
        'A new OTP has been sent to your email'
      );

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({ message: 'OTP resent successfully' }),
        message: 'A new OTP has been sent to your email',
      });
      Date.now.mockRestore();
    });

    it('resends signup OTP with default name when name not provided', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'e@mail.com', otpType: 'signup', role: 'learner' } }; // no name
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce(null);

      await authController.resendOTP(req, res, next);

      // ensure fallback name 'User' is used when name is not provided
      expect(mockEmailService.sendSignupOTP).toHaveBeenCalledWith('e@mail.com', 'User', expect.any(String));
      Date.now.mockRestore();
    });

    it('handles password_reset path', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'e@mail.com', otpType: 'password_reset', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce(null);
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N', is_email_verified: true });

      await authController.resendOTP(req, res, next);

      // controller must lookup user and send password_reset OTP with correct name and store OTP
      expect(mockAuthRepository.findLearnerByEmail).toHaveBeenCalledWith('e@mail.com');
      // accept either actual name or fallback 'User'
      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalledWith('e@mail.com', expect.stringMatching(/^(N|User)$/), expect.any(String));
      expect(mockAuthRepository.storeOTP).toHaveBeenCalledWith('e@mail.com', expect.any(String), 'password_reset', 'learner');
      Date.now.mockRestore();
    });

    it('returns 400 when email is invalid', async () => {
      const req = { body: { email: 'bad', otpType: 'signup', role: 'learner', name: 'N' } };
      const res = resMock();
      const next = nextMock();

      await authController.resendOTP(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 500 from catch path on thrown error', async () => {
      const req = { body: { email: 'e@mail.com', otpType: 'signup', role: 'learner', name: 'N' } };
      const res = resMock();
      const next = nextMock();
      mockValidateEmail.mockReturnValueOnce({ isValid: true, errors: [] });
      mockAuthRepository.getLatestOTP.mockRejectedValueOnce(new Error('boom'));

      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to resend OTP. Please try again.',
      });
      // make sure error logging includes the resend failure fragment
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error in resend OTP:'), expect.anything());
    });
  });

  // --- getPasswordSuggestions ---
  describe('getPasswordSuggestions', () => {
    it('returns suggestions', async () => {
      const req = {}; const res = resMock(); const next = nextMock();
      await authController.getPasswordSuggestions(req, res, next);
      expect(mockGeneratePasswordSuggestions).toHaveBeenCalledWith(5);
      expect(mockSuccessResponse).toHaveBeenCalledWith({ suggestions: ['Sugg1', 'Sugg2', 'Sugg3'] }, 'Password suggestions generated');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { suggestions: ['Sugg1', 'Sugg2', 'Sugg3'] },
        message: 'Password suggestions generated',
      });
    });
  });

  // ========= Additional coverage for remaining branches =========

  describe('signupAdmin (additional branches)', () => {
    it('returns 400 when admin email invalid', async () => {
      const req = { body: { name: 'Admin', email: 'bad', password: 'Good', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      await authController.signupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      // message should reflect validation errors joining with comma
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: expect.any(String) }));
    });

    it('returns 400 when admin password invalid', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'weak', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      mockValidatePassword.mockReturnValueOnce({ isValid: false, errors: ['weak'] });
      await authController.signupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'weak' }));
    });

    it('throws EMAIL_ALREADY_EXISTS when admin exists', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 10 });
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_ALREADY_EXISTS);
    });
  });

  describe('verifySignupAdmin (additional branches)', () => {
    it('returns 400 when OTP invalid format (admin)', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good', otp: '111', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      await authController.verifySignupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      // message should include OTP error text
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: expect.stringContaining('OTP') }));
    });

    it('returns 400 when OTP record not found (admin)', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good', otp: '123456', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);
      await authController.verifySignupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired OTP' });
    });

    it('throws EMAIL_ALREADY_EXISTS when admin exists after OTP', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good', otp: '123456', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 5 });
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 10 });
      await authController.verifySignupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_ALREADY_EXISTS);
    });

    it('throws MISSING_REQUIRED_FIELDS when verifySignupAdmin body missing fields', async () => {
      const req = { body: { name: '', email: '', password: '', otp: '' } };
      const res = resMock(); const next = nextMock();

      await authController.verifySignupAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('throws MISSING_REQUIRED_FIELDS when otp missing but other fields present', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', otp: '', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      await authController.verifySignupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('throws MISSING_REQUIRED_FIELDS when name missing but otp present', async () => {
      const req = { body: { name: '', email: 'a@mail.com', password: 'Good', otp: '123456', adminPassKey: '12345' } };
      const res = resMock(); const next = nextMock();
      await authController.verifySignupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });
  });

  describe('loginAdmin (additional branches)', () => {
    it('missing fields throws', async () => {
      const req = { body: { email: '', password: '' } };
      const res = resMock(); const next = nextMock();
      await authController.loginAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('incorrect password throws', async () => {
      const req = { body: { email: 'a@mail.com', password: 'wrong' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 10, email: 'a@mail.com', password_hash: 'hashed:p' });
      await authController.loginAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.INCORRECT_PASSWORD);
    });
  });

  describe('getProfile (additional branches)', () => {
    it('admin profile null -> USER_NOT_FOUND', async () => {
      const req = { user: { id: 9, role: 'admin' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.getFullAdminProfile.mockResolvedValueOnce(null);
      await authController.getProfile(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.USER_NOT_FOUND);
    });
  });

  describe('updateProfile (additional branches)', () => {
    it('invalid role throws', async () => {
      const req = { user: { id: 1, role: 'guest' }, body: { name: 'X' } };
      const res = resMock(); const next = nextMock();
      // Force name validation to pass so we reach the invalid-role branch
      mockValidateName.mockReturnValueOnce({ isValid: true, errors: [] });
      await authController.updateProfile(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.INVALID_AUTH_TOKEN);
    });

    it('returns 400 when name is empty string', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { name: '   ' } };
      const res = resMock(); const next = nextMock();
      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name cannot be empty',
      });
    });

    it('returns 400 when validateName fails', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { name: 'Z' } };
      const res = resMock(); const next = nextMock();
      mockValidateName.mockReturnValueOnce({ isValid: false, errors: ['bad'] });
      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'bad',
      });
    });

    it('returns 400 when contest_name too long', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { contest_name: 'x'.repeat(51) } };
      const res = resMock();
      const next = nextMock();
      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Contest name must be 50 characters or less',
      });
    });

    it('throws USER_NOT_FOUND when update returns null (admin path)', async () => {
      const req = { user: { id: 1, role: 'admin' }, body: { name: 'Boss' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.updateAdminProfile.mockResolvedValueOnce(null);
      await authController.updateProfile(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.USER_NOT_FOUND);
    });
  });

  describe('verifyResetOTP (additional branches)', () => {
    it('missing required fields throws', async () => {
      const req = { body: { email: '', otp: '', role: '' } };
      const res = resMock(); const next = nextMock();
      await authController.verifyResetOTP(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('invalid otp format returns 400', async () => {
      const req = { body: { email: 'e@mail.com', otp: '1', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      await authController.verifyResetOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'OTP must be a 6-digit number',
      });
      // When format is invalid, repository should not be consulted
      expect(mockAuthRepository.verifyOTP).not.toHaveBeenCalled();
    });

    it('otpRecord not found returns 400', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);
      await authController.verifyResetOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired OTP',
      });
    });

    it('throws MISSING_REQUIRED_FIELDS when email and otp missing but role present', async () => {
      const req = { body: { email: '', otp: '', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      await authController.verifyResetOTP(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });
  });

  describe('resetPassword (additional branches)', () => {
    it('missing required fields throws', async () => {
      const req = { body: { email: '', otp: '', newPassword: '', confirmPassword: '', role: '' } };
      const res = resMock(); const next = nextMock();
      await authController.resetPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });

    it('user not found returns 404 (admin path)', async () => {
      const req = { body: { email: 'x@mail.com', otp: '123456', newPassword: 'p', confirmPassword: 'p', role: 'admin' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);
      await authController.resetPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });

    it('invalid new password returns 400 with suggestions', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: 'x', confirmPassword: 'x', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N' });
      mockValidatePassword.mockReturnValueOnce({ isValid: false, errors: ['weak'] });
      await authController.resetPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'weak',
        suggestions: ['Sugg1', 'Sugg2', 'Sugg3'],
      });
    });

    it('otpRecord not found returns 400', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: 'p', confirmPassword: 'p', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N' });
      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);
      await authController.resetPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired OTP',
      });
    });

    it('admin path updates password and cleans OTPs', async () => {
      const req = { body: { email: 'a@mail.com', otp: '123456', newPassword: 'p', confirmPassword: 'p', role: 'admin' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 2, name: 'A' });
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 11 });
      await authController.resetPassword(req, res, next);
      expect(mockAuthRepository.updateAdminPassword).toHaveBeenCalled();
      expect(mockAuthRepository.markOTPAsUsed).toHaveBeenCalled();
      expect(mockAuthRepository.deleteOTPsByEmail).toHaveBeenCalledWith('a@mail.com', 'password_reset', 'admin');
      expect(res.json).toHaveBeenCalled();
    });

    it('throws MISSING_REQUIRED_FIELDS when newPassword missing but other fields present', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: '', confirmPassword: 'p', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      await authController.resetPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });
  });

  describe('resendOTP (additional branches)', () => {
    it('password_reset learner user not found returns 404', async () => {
      const now = Date.now(); jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'e@mail.com', otpType: 'password_reset', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce(null);
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);
      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      Date.now.mockRestore();
    });

    it('password_reset learner unverified returns 400', async () => {
      const now = Date.now(); jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'e@mail.com', otpType: 'password_reset', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce(null);
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N', is_email_verified: false });
      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      // ensure message retained exactly
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email not verified. Please complete signup verification first.',
      });
      Date.now.mockRestore();
    });

    it('password_reset admin path uses admin name', async () => {
      const now = Date.now(); jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'a@mail.com', otpType: 'password_reset', role: 'admin' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce(null);
      mockAuthRepository.findAdminByEmail
        .mockResolvedValueOnce({ id: 10, name: 'AdminName', is_email_verified: true })
        .mockResolvedValueOnce({ id: 10, name: 'AdminName', is_email_verified: true });

      await authController.resendOTP(req, res, next);

      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalledWith(
        'a@mail.com',
        'AdminName',
        expect.any(String),
      );

      // OTP must be stored with admin context
      expect(mockAuthRepository.storeOTP).toHaveBeenCalledWith('a@mail.com', expect.any(String), 'password_reset', 'admin');

      Date.now.mockRestore();
    });
  });
});
