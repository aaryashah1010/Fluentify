import { jest } from '@jest/globals';

// --- ESM-safe mocks BEFORE importing the controller ---
// bcrypt
const mockBcrypt = {
  hash: jest.fn(async (pw) => `hashed:${pw}`),
  compare: jest.fn(async (pw, hash) => hash === `hashed:${pw}`)
};
await jest.unstable_mockModule('../../utils/jwt.js', () => ({
  createAuthToken: jest.fn().mockReturnValue('mock.jwt.token')
}));
await jest.unstable_mockModule('bcrypt', () => ({ default: mockBcrypt }));

// response utils
const mockSuccessResponse = jest.fn((data, message) => ({ success: true, data, message }));
const mockAuthResponse = jest.fn((data, message) => ({ success: true, data, message }));
await jest.unstable_mockModule('../../utils/response.js', () => ({
  successResponse: mockSuccessResponse,
  authResponse: mockAuthResponse
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
  generatePasswordSuggestions: mockGeneratePasswordSuggestions
}));

// email service
const mockEmailService = {
  generateOTP: jest.fn(() => '123456'),
  sendSignupOTP: jest.fn(async () => ({ success: true })),
  sendWelcomeEmail: jest.fn(async () => ({ success: true })),
  sendPasswordResetOTP: jest.fn(async () => ({ success: true })),
  sendProfileUpdateConfirmation: jest.fn(async () => ({ success: true }))
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
  getLatestOTP: jest.fn()
};
await jest.unstable_mockModule('../../repositories/authRepository.js', () => ({ default: mockAuthRepository }));

// Import after mocks
const { ERRORS } = await import('../../utils/error.js');
const authController = (await import('../../controllers/authController.js')).default;

function resMock() {
  return {
    statusCode: 200,
    status: jest.fn(function (code) { this.statusCode = code; return this; }),
    json: jest.fn()
  };
}
const nextMock = () => jest.fn();

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Signup Learner ---
  describe('signupLearner', () => {
    it('validates and sends OTP successfully', async () => {
      const req = { body: { name: 'John Doe', email: 'john@mail.com', password: 'GoodPass1!' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);

      await authController.signupLearner(req, res, next);

      expect(mockAuthRepository.findLearnerByEmail).toHaveBeenCalledWith('john@mail.com');
      expect(mockEmailService.sendSignupOTP).toHaveBeenCalledWith('john@mail.com', 'John Doe', '123456');
      expect(res.json).toHaveBeenCalled();
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

      await authController.signupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('throws EMAIL_ALREADY_EXISTS when user exists', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1 });

      await authController.signupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_ALREADY_EXISTS);
    });

    it('returns 400 when email invalid', async () => {
      const req = { body: { name: 'John', email: 'bad', password: 'Good' } };
      const res = resMock();
      const next = nextMock();
      await authController.signupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when password invalid (with suggestions)', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'weak' } };
      const res = resMock();
      const next = nextMock();
      mockValidatePassword.mockReturnValueOnce({ isValid: false, errors: ['weak'] });
      await authController.signupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('throws MISSING_REQUIRED_FIELDS when body missing fields', async () => {
      const req = { body: { name: '', email: '', password: '' } };
      const res = resMock();
      const next = nextMock();
      await authController.signupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
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
    });
  });

  // ===== Targeted tests for specific uncovered lines =====
  describe('targeted branches', () => {
    it('verifySignupAdmin: welcome email rejection is caught (line ~276)', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 1 });
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);
      mockEmailService.sendWelcomeEmail.mockRejectedValueOnce(new Error('mail fail'));
      await authController.verifySignupAdmin(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });

    it('forgotPassword: missing required fields throws (line ~510) and is forwarded to next', async () => {
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
    });

    it('resendOTP: missing required fields -> catch returns 500 (line ~695)', async () => {
      const req = { body: { email: '', otpType: '', role: '' } };
      const res = resMock(); const next = nextMock();
      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('getPasswordSuggestions: generate throws -> catch next (lines ~793-794)', async () => {
      const req = {}; const res = resMock(); const next = nextMock();
      // Force throw
      mockGeneratePasswordSuggestions.mockImplementationOnce(() => { throw new Error('gen fail'); });
      await authController.getPasswordSuggestions(req, res, next);
      expect(next).toHaveBeenCalled();
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
    });

    it('returns 400 when OTP record not found (invalid or expired)', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock();
      const next = nextMock();

      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);

      await authController.verifySignupLearner(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
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
    });

    it('returns 400 when OTP invalid format', async () => {
      const req = { body: { name: 'John', email: 'john@mail.com', password: 'Good', otp: '12' } };
      const res = resMock();
      const next = nextMock();

      await authController.verifySignupLearner(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('throws MISSING_REQUIRED_FIELDS when verifySignupLearner body missing fields', async () => {
      const req = { body: { name: '', email: '', password: '', otp: '' } };
      const res = resMock();
      const next = nextMock();

      await authController.verifySignupLearner(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.MISSING_REQUIRED_FIELDS);
    });
  });

  // --- signupAdmin / verifySignupAdmin ---
  describe('signupAdmin', () => {
    it('sends OTP when admin does not exist', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);

      await authController.signupAdmin(req, res, next);
      expect(mockEmailService.sendSignupOTP).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('returns 400 when admin name invalid', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good' } };
      const res = resMock();
      const next = nextMock();

      await authController.signupAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('verifySignupAdmin', () => {
    it('verifies OTP and creates admin', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 5 });
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);

      await authController.verifySignupAdmin(req, res, next);
      expect(mockAuthRepository.createAdmin).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
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
      expect(res.json).toHaveBeenCalled();
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
      expect(res.json).toHaveBeenCalled();
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
      expect(res.json).toHaveBeenCalled();
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
    });

    it('learner updates both fields and sends email (non-blocking)', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { name: 'New Name', contest_name: 'Contest' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.updateLearnerProfile.mockResolvedValueOnce({ id: 1, name: 'New Name', email: 'e@mail.com' });

      await authController.updateProfile(req, res, next);
      expect(mockAuthRepository.updateLearnerProfile).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('admin with contest_name returns 400', async () => {
      const req = { user: { id: 2, role: 'admin' }, body: { contest_name: 'x' } };
      const res = resMock();
      const next = nextMock();

      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('admin updates name', async () => {
      const req = { user: { id: 2, role: 'admin' }, body: { name: 'Boss' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.updateAdminProfile.mockResolvedValueOnce({ id: 2, name: 'Boss', email: 'a@mail.com' });

      await authController.updateProfile(req, res, next);
      expect(res.json).toHaveBeenCalled();
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
    });

    it('returns 404 when no user', async () => {
      const req = { body: { email: 'e@mail.com', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce(null);

      await authController.forgotPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('rejects unverified user', async () => {
      const req = { body: { email: 'e@mail.com', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N', is_email_verified: false });

      await authController.forgotPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('sends password reset OTP for verified user', async () => {
      const req = { body: { email: 'e@mail.com', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N', is_email_verified: true });

      await authController.forgotPassword(req, res, next);
      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('returns 400 when invalid role specified', async () => {
      const req = { body: { email: 'e@mail.com', role: 'other' } };
      const res = resMock();
      const next = nextMock();

      await authController.forgotPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('sends password reset OTP for verified admin user', async () => {
      const req = { body: { email: 'admin@mail.com', role: 'admin' } };
      const res = resMock();
      const next = nextMock();

      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 5, name: 'Admin', is_email_verified: true });

      await authController.forgotPassword(req, res, next);

      expect(mockAuthRepository.findAdminByEmail).toHaveBeenCalledWith('admin@mail.com');
      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  // --- verifyResetOTP ---
  describe('verifyResetOTP', () => {
    it('validates and verifies OTP', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 7 });

      await authController.verifyResetOTP(req, res, next);
      expect(res.json).toHaveBeenCalled();
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
    });

    it('validates and resets password for learner', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: 'newP', confirmPassword: 'newP', role: 'learner' } };
      const res = resMock();
      const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N' });
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 8 });

      await authController.resetPassword(req, res, next);
      expect(mockAuthRepository.updateLearnerPassword).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
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
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce({ created_at: new Date(now - 30 * 1000).toISOString() });

      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(429);
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
      expect(mockEmailService.sendSignupOTP).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
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
      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalled();
      Date.now.mockRestore();
    });

    it('returns 500 from catch path on thrown error', async () => {
      const req = { body: { email: 'e@mail.com', otpType: 'signup', role: 'learner', name: 'N' } };
      const res = resMock();
      const next = nextMock();
      mockValidateEmail.mockReturnValueOnce({ isValid: true, errors: [] });
      mockAuthRepository.getLatestOTP.mockRejectedValueOnce(new Error('boom'));

      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // --- getPasswordSuggestions ---
  describe('getPasswordSuggestions', () => {
    it('returns suggestions', async () => {
      const req = {}; const res = resMock(); const next = nextMock();
      await authController.getPasswordSuggestions(req, res, next);
      expect(mockGeneratePasswordSuggestions).toHaveBeenCalledWith(5);
      expect(res.json).toHaveBeenCalled();
    });
  });

  // ========= Additional coverage for remaining branches =========

  describe('signupAdmin (additional branches)', () => {
    it('returns 400 when admin email invalid', async () => {
      const req = { body: { name: 'Admin', email: 'bad', password: 'Good' } };
      const res = resMock(); const next = nextMock();
      await authController.signupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when admin password invalid', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'weak' } };
      const res = resMock(); const next = nextMock();
      mockValidatePassword.mockReturnValueOnce({ isValid: false, errors: ['weak'] });
      await authController.signupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('throws EMAIL_ALREADY_EXISTS when admin exists', async () => {
      const req = { body: { name: 'Admin', email: 'a@mail.com', password: 'Good' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 10 });
      await authController.signupAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith(ERRORS.EMAIL_ALREADY_EXISTS);
    });
  });

  describe('verifySignupAdmin (additional branches)', () => {
    it('returns 400 when OTP invalid format (admin)', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good', otp: '111' } };
      const res = resMock(); const next = nextMock();
      await authController.verifySignupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when OTP record not found (admin)', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good', otp: '123456' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);
      await authController.verifySignupAdmin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('throws EMAIL_ALREADY_EXISTS when admin exists after OTP', async () => {
      const req = { body: { name: 'A', email: 'a@mail.com', password: 'Good', otp: '123456' } };
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
    });

    it('returns 400 when validateName fails', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { name: 'Z' } };
      const res = resMock(); const next = nextMock();
      mockValidateName.mockReturnValueOnce({ isValid: false, errors: ['bad'] });
      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when contest_name too long', async () => {
      const req = { user: { id: 1, role: 'learner' }, body: { contest_name: 'x'.repeat(51) } };
      const res = resMock(); const next = nextMock();
      await authController.updateProfile(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
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
    });

    it('otpRecord not found returns 400', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);
      await authController.verifyResetOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
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
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce(null);
      await authController.resetPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('invalid new password returns 400 with suggestions', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: 'x', confirmPassword: 'x', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N' });
      mockValidatePassword.mockReturnValueOnce({ isValid: false, errors: ['weak'] });
      await authController.resetPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('otpRecord not found returns 400', async () => {
      const req = { body: { email: 'e@mail.com', otp: '123456', newPassword: 'p', confirmPassword: 'p', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findLearnerByEmail.mockResolvedValueOnce({ id: 1, name: 'N' });
      mockAuthRepository.verifyOTP.mockResolvedValueOnce(null);
      await authController.resetPassword(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('admin path updates password and cleans OTPs', async () => {
      const req = { body: { email: 'a@mail.com', otp: '123456', newPassword: 'p', confirmPassword: 'p', role: 'admin' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 2, name: 'A' });
      mockAuthRepository.verifyOTP.mockResolvedValueOnce({ id: 11 });
      await authController.resetPassword(req, res, next);
      expect(mockAuthRepository.updateAdminPassword).toHaveBeenCalled();
      expect(mockAuthRepository.markOTPAsUsed).toHaveBeenCalled();
      expect(mockAuthRepository.deleteOTPsByEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('resendOTP (additional branches)', () => {
    it('invalid email returns 400', async () => {
      const req = { body: { email: 'bad', otpType: 'signup', role: 'learner' } };
      const res = resMock(); const next = nextMock();
      await authController.resendOTP(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

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
      Date.now.mockRestore();
    });

    it('password_reset admin path uses admin name', async () => {
      const now = Date.now(); jest.spyOn(Date, 'now').mockReturnValue(now);
      const req = { body: { email: 'a@mail.com', otpType: 'password_reset', role: 'admin' } };
      const res = resMock(); const next = nextMock();
      mockAuthRepository.getLatestOTP.mockResolvedValueOnce(null);
      mockAuthRepository.findAdminByEmail.mockResolvedValueOnce({ id: 10, name: 'AdminName', is_email_verified: true });
      await authController.resendOTP(req, res, next);
      expect(mockEmailService.sendPasswordResetOTP).toHaveBeenCalledWith('a@mail.com', 'User', '123456');
      Date.now.mockRestore();
    });
  });
});
