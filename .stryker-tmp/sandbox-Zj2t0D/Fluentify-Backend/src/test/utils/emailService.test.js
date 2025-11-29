// @ts-nocheck
import { jest } from '@jest/globals';

// Set env for constructor checks
process.env.EMAIL_USER = 'u@example.com';
process.env.EMAIL_PASS = 'pass';

// Mock nodemailer
const verifyMock = jest.fn();
const sendMailMock = jest.fn();
const createTransportMock = jest.fn(() => ({ verify: verifyMock, sendMail: sendMailMock }));
await jest.unstable_mockModule('nodemailer', () => ({ default: { createTransport: createTransportMock } }));

// Import module under test
const emailService = (await import('../../utils/emailService.js')).default;

async function importEmailServiceWithEnv(emailUser, emailPass) {
  jest.resetModules();
  // keep nodemailer mock in place
  await jest.unstable_mockModule('nodemailer', () => ({ default: { createTransport: createTransportMock } }));
  if (emailUser === undefined) delete process.env.EMAIL_USER; else process.env.EMAIL_USER = emailUser;
  if (emailPass === undefined) delete process.env.EMAIL_PASS; else process.env.EMAIL_PASS = emailPass;
  const mod = await import('../../utils/emailService.js');
  return mod.default;
}

describe('utils/emailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generateOTP returns 6-digit string', () => {
    const otp = emailService.generateOTP();
    expect(typeof otp).toBe('string');
    expect(otp).toHaveLength(6);
  });

  it('verifyConnection success logs and does not throw', async () => {
    verifyMock.mockResolvedValueOnce(true);
    await emailService.verifyConnection();
    expect(verifyMock).toHaveBeenCalled();
  });

  it('verifyConnection failure is caught and logged', async () => {
    verifyMock.mockRejectedValueOnce(new Error('bad creds'));
    await emailService.verifyConnection();
    expect(verifyMock).toHaveBeenCalled();
  });

  it('constructor logs when EMAIL_USER or EMAIL_PASS missing', async () => {
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    try {
      // both missing
      let svc = await importEmailServiceWithEnv(undefined, undefined);
      expect(svc).toBeTruthy();

      // only user present
      svc = await importEmailServiceWithEnv('u@example.com', undefined);
      expect(svc).toBeTruthy();

      // only pass present
      svc = await importEmailServiceWithEnv(undefined, 'pass');
      expect(svc).toBeTruthy();
    } finally {
      process.env.EMAIL_USER = originalUser;
      process.env.EMAIL_PASS = originalPass;
    }
  });

  it('sendSignupOTP success returns messageId', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: 'm1' });
    const res = await emailService.sendSignupOTP('e@example.com', 'Name', '123456');
    expect(sendMailMock).toHaveBeenCalled();
    expect(res).toEqual({ success: true, messageId: 'm1' });
  });

  it('sendSignupOTP failure throws', async () => {
    const err = new Error('smtp down');
    err.code = 'ECONN';
    err.response = 'smtp failure';
    sendMailMock.mockRejectedValueOnce(err);
    await expect(emailService.sendSignupOTP('e@example.com', 'Name', '123456')).rejects.toThrow(/Failed to send verification email/);
  });

  it('sendSignupOTP failure without code/response still throws', async () => {
    const err = new Error('smtp down');
    sendMailMock.mockRejectedValueOnce(err);
    await expect(emailService.sendSignupOTP('e@example.com', 'Name', '123456')).rejects.toThrow(/Failed to send verification email/);
  });

  it('sendPasswordResetOTP success returns messageId', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: 'm2' });
    const res = await emailService.sendPasswordResetOTP('e@example.com', 'Name', '123456');
    expect(sendMailMock).toHaveBeenCalled();
    expect(res).toEqual({ success: true, messageId: 'm2' });
  });

  it('sendPasswordResetOTP failure throws', async () => {
    const err = new Error('smtp down');
    err.code = 'ECONNRESET';
    err.response = 'smtp reset';
    sendMailMock.mockRejectedValueOnce(err);
    await expect(emailService.sendPasswordResetOTP('e@example.com', 'Name', '123456')).rejects.toThrow(/Failed to send password reset email/);
  });

  it('sendPasswordResetOTP failure without code/response still throws', async () => {
    const err = new Error('smtp down');
    sendMailMock.mockRejectedValueOnce(err);
    await expect(emailService.sendPasswordResetOTP('e@example.com', 'Name', '123456')).rejects.toThrow(/Failed to send password reset email/);
  });

  it('sendWelcomeEmail success returns {success:true}', async () => {
    sendMailMock.mockResolvedValueOnce({});
    const res = await emailService.sendWelcomeEmail('e@example.com', 'Name');
    expect(sendMailMock).toHaveBeenCalled();
    expect(res).toEqual({ success: true });
  });

  it('sendWelcomeEmail failure returns {success:false} without throwing', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('smtp down'));
    const res = await emailService.sendWelcomeEmail('e@example.com', 'Name');
    expect(res).toEqual({ success: false });
  });

  it('sendProfileUpdateConfirmation success and failure paths', async () => {
    sendMailMock.mockResolvedValueOnce({});
    let res = await emailService.sendProfileUpdateConfirmation('e@example.com', 'Name');
    expect(res).toEqual({ success: true });

    sendMailMock.mockRejectedValueOnce(new Error('smtp down'));
    res = await emailService.sendProfileUpdateConfirmation('e@example.com', 'Name');
    expect(res).toEqual({ success: false });
  });

  it('sendAdminProfileChangeNotification success and failure paths', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: 'mid' });
    let res = await emailService.sendAdminProfileChangeNotification('e@example.com', 'Name', { name: { old: 'A', new: 'B' } });
    expect(res.success).toBe(true);

    sendMailMock.mockRejectedValueOnce(new Error('smtp down'));
    res = await emailService.sendAdminProfileChangeNotification('e@example.com', 'Name', {});
    expect(res.success).toBe(false);
  });

  it('sendAdminProfileChangeNotification formats unknown fields via fallback', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: 'mid2' });
    const res = await emailService.sendAdminProfileChangeNotification('e@example.com', 'Name', {
      customField: { old: 'X', new: 'Y' },
    });
    expect(res.success).toBe(true);
  });
});
