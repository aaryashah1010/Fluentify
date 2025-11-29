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

async function importEmailServiceWithEnvAndMockedDotenv(emailUser, emailPass) {
  jest.resetModules();
  await jest.unstable_mockModule('nodemailer', () => ({ default: { createTransport: createTransportMock } }));
  const mockConfig = jest.fn();
  await jest.unstable_mockModule('dotenv', () => ({ default: { config: mockConfig }, config: mockConfig }));
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

  it('generateOTP uses expected numeric range with deterministic Math.random', () => {
    const originalRandom = Math.random;
    try {
      Math.random = jest.fn(() => 0.5);
      const otp = emailService.generateOTP();
      expect(otp).toBe('550000');
    } finally {
      Math.random = originalRandom;
    }
  });

  it('creates transporter with gmail service and auth based on env vars', async () => {
    jest.clearAllMocks();
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    try {
      const user = 'cfg@example.com';
      const pass = 'secret';
      await importEmailServiceWithEnvAndMockedDotenv(user, pass);

      expect(createTransportMock).toHaveBeenCalledTimes(1);
      const arg = createTransportMock.mock.calls[0][0];
      expect(arg.service).toBe('gmail');
      expect(arg.auth).toEqual({ user, pass });
    } finally {
      process.env.EMAIL_USER = originalUser;
      process.env.EMAIL_PASS = originalPass;
    }
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

  it('verifyConnection success logs configured email', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      verifyMock.mockResolvedValueOnce(true);
      await emailService.verifyConnection();

      const messages = logSpy.mock.calls.map(args => args.join(' '));
      expect(messages.some(m => m.includes('Email service connected successfully'))).toBe(true);
      expect(messages.some(m => m.includes('Using email:') && m.includes(process.env.EMAIL_USER))).toBe(true);
    } finally {
      logSpy.mockRestore();
    }
  });

  it('verifyConnection logs detailed error information on failure', async () => {
    const error = new Error('bad creds');
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      verifyMock.mockRejectedValueOnce(error);
      await emailService.verifyConnection();

      const messages = logSpy.mock.calls.map(args => args.join(' '));
      expect(messages.some(m => m.includes('Email service connection failed'))).toBe(true);
      expect(messages.some(m => m.includes('Error:') && m.includes('bad creds'))).toBe(true);
      expect(messages.some(m => m.includes('Check your EMAIL_USER and EMAIL_PASS in .env file'))).toBe(true);
      expect(messages.some(m => m.includes('For Gmail, you need an App Password (not your regular password)'))).toBe(true);
    } finally {
      logSpy.mockRestore();
    }
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

  it('constructor logs detailed configuration error when env vars missing with mocked dotenv', async () => {
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const svc = await importEmailServiceWithEnvAndMockedDotenv(undefined, undefined);
      expect(svc).toBeTruthy();

      const calls = errorSpy.mock.calls.map(args => args.join(' '));
      expect(calls.some(msg => msg.includes('EMAIL CONFIGURATION ERROR'))).toBe(true);
      expect(calls.some(msg => msg.includes('EMAIL_USER:') && msg.includes('Missing'))).toBe(true);
      expect(calls.some(msg => msg.includes('EMAIL_PASS:') && msg.includes('Missing'))).toBe(true);
    } finally {
      errorSpy.mockRestore();
      if (originalUser === undefined) delete process.env.EMAIL_USER; else process.env.EMAIL_USER = originalUser;
      if (originalPass === undefined) delete process.env.EMAIL_PASS; else process.env.EMAIL_PASS = originalPass;
    }
  });

  it('constructor logs set/missing status for each env var', async () => {
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      // user set, pass missing
      await importEmailServiceWithEnvAndMockedDotenv('u@example.com', undefined);

      const calls = errorSpy.mock.calls.map(args => args.join(' '));
      expect(calls.some(msg => msg.includes('EMAIL_USER:') && msg.includes('✓ Set'))).toBe(true);
      expect(calls.some(msg => msg.includes('EMAIL_PASS:') && msg.includes('✗ Missing'))).toBe(true);
    } finally {
      errorSpy.mockRestore();
      if (originalUser === undefined) delete process.env.EMAIL_USER; else process.env.EMAIL_USER = originalUser;
      if (originalPass === undefined) delete process.env.EMAIL_PASS; else process.env.EMAIL_PASS = originalPass;
    }
  });

  it('constructor logs help message advising to configure EMAIL_USER and EMAIL_PASS', async () => {
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      await importEmailServiceWithEnvAndMockedDotenv(undefined, undefined);
      const calls = errorSpy.mock.calls.map(args => args.join(' '));
      expect(calls.some(msg => msg.includes('Please add EMAIL_USER and EMAIL_PASS to your .env file'))).toBe(true);
    } finally {
      errorSpy.mockRestore();
      if (originalUser === undefined) delete process.env.EMAIL_USER; else process.env.EMAIL_USER = originalUser;
      if (originalPass === undefined) delete process.env.EMAIL_PASS; else process.env.EMAIL_PASS = originalPass;
    }
  });

  it('constructor does not log configuration error when env vars are present', async () => {
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      await importEmailServiceWithEnvAndMockedDotenv('u@example.com', 'pass');
      const calls = errorSpy.mock.calls.map(args => args.join(' '));
      expect(calls.some(msg => msg.includes('EMAIL CONFIGURATION ERROR'))).toBe(false);
    } finally {
      errorSpy.mockRestore();
      if (originalUser === undefined) delete process.env.EMAIL_USER; else process.env.EMAIL_USER = originalUser;
      if (originalPass === undefined) delete process.env.EMAIL_PASS; else process.env.EMAIL_PASS = originalPass;
    }
  });

  it('constructor logs EMAIL_PASS as set when only pass is configured', async () => {
    const originalUser = process.env.EMAIL_USER;
    const originalPass = process.env.EMAIL_PASS;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      // user missing, pass set
      await importEmailServiceWithEnvAndMockedDotenv(undefined, 'pass');

      const calls = errorSpy.mock.calls.map(args => args.join(' '));
      expect(calls.some(msg => msg.includes('EMAIL_USER:') && msg.includes('✗ Missing'))).toBe(true);
      expect(calls.some(msg => msg.includes('EMAIL_PASS:') && msg.includes('✓ Set'))).toBe(true);
    } finally {
      errorSpy.mockRestore();
      if (originalUser === undefined) delete process.env.EMAIL_USER; else process.env.EMAIL_USER = originalUser;
      if (originalPass === undefined) delete process.env.EMAIL_PASS; else process.env.EMAIL_PASS = originalPass;
    }
  });

  it('sendSignupOTP success returns messageId and logs details', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      sendMailMock.mockResolvedValueOnce({ messageId: 'm1' });
      const res = await emailService.sendSignupOTP('e@example.com', 'Name', '123456');

      expect(res).toEqual({ success: true, messageId: 'm1' });
      expect(sendMailMock).toHaveBeenCalledTimes(1);

      const logMessages = logSpy.mock.calls.map(args => args.join(' '));
      expect(logMessages.some(m => m.includes('📧 Sending signup OTP to: e@example.com'))).toBe(true);
      expect(logMessages.some(m => m.includes('✅ Signup OTP sent successfully to e@example.com'))).toBe(true);
      expect(logMessages.some(m => m.includes('Message ID: m1'))).toBe(true);
    } finally {
      logSpy.mockRestore();
    }
  });

  it('sendSignupOTP failure logs full error details including code and response', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const err = new Error('smtp down');
      err.code = 'ECONN';
      err.response = 'smtp failure';
      sendMailMock.mockRejectedValueOnce(err);

      await expect(
        emailService.sendSignupOTP('e@example.com', 'Name', '123456')
      ).rejects.toThrow(/Failed to send verification email/);

      const messages = errorSpy.mock.calls.map(args => args.join(' '));
      expect(messages.some(m => m.includes('Failed to send signup OTP to e@example.com'))).toBe(true);
      expect(messages.some(m => m.includes('Error: smtp down'))).toBe(true);
      expect(messages.some(m => m.includes('Code: ECONN'))).toBe(true);
      expect(messages.some(m => m.includes('Response: smtp failure'))).toBe(true);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('sendSignupOTP builds correct mail options with HTML content', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: 'm2' });
    const email = 'e@example.com';
    const name = 'Name';
    const otp = '123456';

    await emailService.sendSignupOTP(email, name, otp);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mailOptions = sendMailMock.mock.calls[0][0];
    expect(mailOptions.from).toBe(`Fluentify <${process.env.EMAIL_USER}>`);
    expect(mailOptions.to).toBe(email);
    expect(mailOptions.subject).toBe('Verify Your Email - Fluentify');
    expect(mailOptions.html).toContain('Welcome to Fluentify');
    expect(mailOptions.html).toContain(`Hi ${name}`);
    expect(mailOptions.html).toContain(otp);
    expect(mailOptions.html).toContain('This OTP will expire in 2 minutes');
    expect(mailOptions.html).toContain('This is an automated email. Please do not reply.');
  });

  it('sendSignupOTP failure without code/response does not log code/response lines', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const err = new Error('smtp down');
      sendMailMock.mockRejectedValueOnce(err);
      await expect(
        emailService.sendSignupOTP('e@example.com', 'Name', '123456')
      ).rejects.toThrow(/Failed to send verification email/);

      const messages = errorSpy.mock.calls.map(args => args.join(' '));
      // Should have generic error message
      expect(messages.some(m => m.includes('Failed to send signup OTP to e@example.com'))).toBe(true);
      expect(messages.some(m => m.includes('Error: smtp down'))).toBe(true);
      // But no code/response specific lines when properties are missing
      expect(messages.some(m => m.includes('Code:'))).toBe(false);
      expect(messages.some(m => m.includes('Response:'))).toBe(false);
    } finally {
      errorSpy.mockRestore();
    }
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

  it('sendPasswordResetOTP builds correct mail options with HTML content', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: 'm4' });
    const email = 'e@example.com';
    const name = 'Name';
    const otp = '654321';

    await emailService.sendPasswordResetOTP(email, name, otp);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mailOptions = sendMailMock.mock.calls[0][0];
    expect(mailOptions.from).toBe(`Fluentify <${process.env.EMAIL_USER}>`);
    expect(mailOptions.to).toBe(email);
    expect(mailOptions.subject).toBe('Reset Your Password - Fluentify');
    expect(mailOptions.html).toContain('Password Reset Request');
    expect(mailOptions.html).toContain(`Hi ${name}`);
    expect(mailOptions.html).toContain(otp);
    expect(mailOptions.html).toContain('If you didn\'t request a password reset');
  });

  it('sendPasswordResetOTP logs success and failure details including code and response', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      sendMailMock.mockResolvedValueOnce({ messageId: 'mReset' });
      await emailService.sendPasswordResetOTP('e@example.com', 'Name', '123456');

      const logMessages = logSpy.mock.calls.map(args => args.join(' '));
      expect(logMessages.some(m => m.includes('Sending password reset OTP to: e@example.com'))).toBe(true);
      expect(logMessages.some(m => m.includes('Password reset OTP sent successfully to e@example.com'))).toBe(true);
      expect(logMessages.some(m => m.includes('Message ID: mReset'))).toBe(true);

      const err = new Error('smtp down');
      err.code = 'ECONNRESET';
      err.response = 'smtp reset';
      sendMailMock.mockRejectedValueOnce(err);
      await expect(emailService.sendPasswordResetOTP('e@example.com', 'Name', '123456')).rejects.toThrow(/Failed to send password reset email/);

      const errorMessages = errorSpy.mock.calls.map(args => args.join(' '));
      expect(errorMessages.some(m => m.includes('Failed to send password reset OTP to e@example.com'))).toBe(true);
      expect(errorMessages.some(m => m.includes('Error: smtp down'))).toBe(true);
      expect(errorMessages.some(m => m.includes('Code: ECONNRESET'))).toBe(true);
      expect(errorMessages.some(m => m.includes('Response: smtp reset'))).toBe(true);
    } finally {
      logSpy.mockRestore();
      errorSpy.mockRestore();
    }
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

  it('sendWelcomeEmail builds correct mail options and logs failure details', async () => {
    sendMailMock.mockResolvedValueOnce({});
    await emailService.sendWelcomeEmail('e@example.com', 'Name');

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mailOptions = sendMailMock.mock.calls[0][0];
    expect(mailOptions.from).toBe(`Fluentify <${process.env.EMAIL_USER}>`);
    expect(mailOptions.to).toBe('e@example.com');
    expect(mailOptions.subject).toBe('Welcome to Fluentify!');
    expect(mailOptions.html).toContain('Welcome to Fluentify');
    expect(mailOptions.html).toContain('Your email has been successfully verified');

    const error = new Error('smtp down');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      sendMailMock.mockRejectedValueOnce(error);
      const res = await emailService.sendWelcomeEmail('e@example.com', 'Name');
      expect(res).toEqual({ success: false });

      const messages = errorSpy.mock.calls.map(args => args.join(' '));
      expect(messages.some(m => m.includes('Error sending welcome email:'))).toBe(true);
      expect(messages.some(m => m.includes('smtp down'))).toBe(true);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('sendProfileUpdateConfirmation success and failure paths', async () => {
    sendMailMock.mockResolvedValueOnce({});
    let res = await emailService.sendProfileUpdateConfirmation('e@example.com', 'Name');
    expect(res).toEqual({ success: true });

    sendMailMock.mockRejectedValueOnce(new Error('smtp down'));
    res = await emailService.sendProfileUpdateConfirmation('e@example.com', 'Name');
    expect(res).toEqual({ success: false });
  });

  it('sendProfileUpdateConfirmation builds correct mail options and logs failures', async () => {
    sendMailMock.mockResolvedValueOnce({});
    await emailService.sendProfileUpdateConfirmation('e@example.com', 'Name');

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mailOptions = sendMailMock.mock.calls[0][0];
    expect(mailOptions.from).toBe(`Fluentify <${process.env.EMAIL_USER}>`);
    expect(mailOptions.to).toBe('e@example.com');
    expect(mailOptions.subject).toBe('Your Profile Was Updated - Fluentify');
    expect(mailOptions.html).toContain('Profile Updated');
    expect(mailOptions.html).toContain('This is a confirmation that your profile details were updated successfully.');

    const error = new Error('smtp down');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      sendMailMock.mockRejectedValueOnce(error);
      const res = await emailService.sendProfileUpdateConfirmation('e@example.com', 'Name');
      expect(res).toEqual({ success: false });

      const messages = errorSpy.mock.calls.map(args => args.join(' '));
      expect(messages.some(m => m.includes('Error sending profile update confirmation:'))).toBe(true);
      expect(messages.some(m => m.includes('smtp down'))).toBe(true);
    } finally {
      errorSpy.mockRestore();
    }
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

  it('sendAdminProfileChangeNotification builds correct mail options and formats changes in text and HTML', async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: 'mid3' });
    const changes = {
      name: { old: 'Old Name', new: 'New Name' },
      email: { old: 'old@example.com', new: 'new@example.com' },
      phone: { old: '111', new: '222' },
      customField: { old: 'X', new: 'Y' },
    };

    await emailService.sendAdminProfileChangeNotification('e@example.com', 'Name', changes);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mailOptions = sendMailMock.mock.calls[0][0];

    expect(mailOptions.from).toBe(`Fluentify <${process.env.EMAIL_USER}>`);
    expect(mailOptions.to).toBe('e@example.com');
    expect(mailOptions.subject).toBe('Your Fluentify Profile Has Been Updated');

    const text = mailOptions.text;
    expect(text).toContain('Hello Name');
    expect(text).toContain('Changes made:');
    expect(text).toContain('• Name: Changed from "Old Name" to "New Name"');
    expect(text).toContain('• Email Address: Changed from "old@example.com" to "new@example.com"');
    expect(text).toContain('• Phone Number: Changed from "111" to "222"');
    expect(text).toContain('• CustomField: Changed from "X" to "Y"');
    expect(text).not.toContain('Stryker was here!');

    const html = mailOptions.html;
    expect(html).toContain('Profile Update Notification');
    expect(html).toContain('Changes Made:');
    expect(html).toContain('field-name');
    expect(html).toContain('This is an automated message from Fluentify. Please do not reply to this email.');
  });

  it('sendAdminProfileChangeNotification logs success and failure details', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      sendMailMock.mockResolvedValueOnce({ messageId: 'mid4' });
      await emailService.sendAdminProfileChangeNotification('e@example.com', 'Name', { name: { old: 'A', new: 'B' } });

      const logMessages = logSpy.mock.calls.map(args => args.join(' '));
      expect(logMessages.some(m => m.includes('📧 Sending profile update notification to: e@example.com'))).toBe(true);
      expect(logMessages.some(m => m.includes('Profile update notification sent successfully to e@example.com'))).toBe(true);
      expect(logMessages.some(m => m.includes('Message ID: mid4'))).toBe(true);

      const error = new Error('smtp down');
      sendMailMock.mockRejectedValueOnce(error);
      const res = await emailService.sendAdminProfileChangeNotification('e@example.com', 'Name', {});
      expect(res.success).toBe(false);

      const errorMessages = errorSpy.mock.calls.map(args => args.join(' '));
      expect(errorMessages.some(m => m.includes('❌ Failed to send profile update notification to e@example.com'))).toBe(true);
      expect(errorMessages.some(m => m.includes('Error: smtp down'))).toBe(true);
    } finally {
      logSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });
});
