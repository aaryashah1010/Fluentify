/**
 * Email Verification Controller
 * Handles OTP generation, sending, and verification
 */

import { validateEmail } from '../utils/emailValidator.js';
import { generateOTP, generateOTPExpiry, isOTPValid, sendOTPEmail } from '../services/otpService.js';
import otpRepository from '../repositories/otpRepository.js';
import authRepository from '../repositories/authRepository.js';
import { ERRORS } from '../utils/error.js';
import { successResponse } from '../utils/response.js';

class EmailVerificationController {
  /**
   * Send OTP to email for verification
   */
  async sendOTP(req, res, next) {
    try {
      const { email, name } = req.body;

      if (!email) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate email format and check for disposable emails
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        if (emailValidation.isDisposable) {
          throw ERRORS.DISPOSABLE_EMAIL;
        }
        throw ERRORS.INVALID_EMAIL;
      }

      // Check if email has exceeded daily OTP limit (3 per day)
      const hasExceededLimit = await otpRepository.hasExceededOTPLimit(email);
      if (hasExceededLimit) {
        const error = { ...ERRORS.OTP_RATE_LIMIT };
        error.details = {
          message: 'Maximum OTP generation limit reached (3 per day). Please try again tomorrow.'
        };
        throw error;
      }

      // Check rate limiting - can user request new OTP?
      const canRequest = await otpRepository.canRequestNewOTP(email);
      if (!canRequest) {
        const waitTime = await otpRepository.getTimeUntilNextOTP(email);
        const error = { ...ERRORS.OTP_RATE_LIMIT };
        error.details = {
          waitTime,
          message: `Please wait ${waitTime} seconds before requesting a new OTP`
        };
        throw error;
      }

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = generateOTPExpiry();

      // Store OTP in database
      await otpRepository.createOTP(email, otp, expiresAt);

      // Send OTP via email
      const emailSent = await sendOTPEmail(email, otp, name || 'User');
      if (!emailSent) {
        throw ERRORS.OTP_SEND_FAILED;
      }

      res.json(successResponse(
        { 
          email,
          expiresIn: 120 // 2 minutes in seconds
        },
        'OTP sent successfully to your email'
      ));
    } catch (error) {
      console.error('Error sending OTP:', error);
      next(error);
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Get latest OTP for this email
      const otpRecord = await otpRepository.getLatestOTP(email);

      if (!otpRecord) {
        throw ERRORS.INVALID_OTP;
      }

      // Check if OTP has expired
      if (!isOTPValid(otpRecord.expires_at)) {
        throw ERRORS.OTP_EXPIRED;
      }

      // Check max attempts (prevent brute force) - 3 attempts max
      if (otpRecord.attempts >= 3) {
        throw ERRORS.MAX_OTP_ATTEMPTS;
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        // Increment failed attempts
        await otpRepository.incrementAttempts(email);
        throw ERRORS.INVALID_OTP;
      }

      // Mark OTP as verified
      await otpRepository.verifyOTP(email, otp);

      // Update user's email_verified status if they exist
      const learner = await authRepository.findLearnerByEmail(email);
      if (learner) {
        await authRepository.markEmailVerified(email, 'learner');
      }

      const admin = await authRepository.findAdminByEmail(email);
      if (admin) {
        await authRepository.markEmailVerified(email, 'admin');
      }

      res.json(successResponse(
        { 
          email,
          verified: true
        },
        'Email verified successfully'
      ));
    } catch (error) {
      console.error('Error verifying OTP:', error);
      next(error);
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(req, res, next) {
    try {
      const { email, name } = req.body;

      if (!email) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Check rate limiting
      const canRequest = await otpRepository.canRequestNewOTP(email);
      if (!canRequest) {
        const waitTime = await otpRepository.getTimeUntilNextOTP(email);
        const error = { ...ERRORS.OTP_RATE_LIMIT };
        error.details = {
          waitTime,
          message: `Please wait ${waitTime} seconds before requesting a new OTP`
        };
        throw error;
      }

      // Generate new OTP
      const otp = generateOTP();
      const expiresAt = generateOTPExpiry();

      // Store new OTP
      await otpRepository.createOTP(email, otp, expiresAt);

      // Send OTP via email
      const emailSent = await sendOTPEmail(email, otp, name || 'User');
      if (!emailSent) {
        throw ERRORS.OTP_SEND_FAILED;
      }

      res.json(successResponse(
        { 
          email,
          expiresIn: 120 // 2 minutes in seconds
        },
        'New OTP sent successfully'
      ));
    } catch (error) {
      console.error('Error resending OTP:', error);
      next(error);
    }
  }

  /**
   * Check if email is verified
   */
  async checkVerificationStatus(req, res, next) {
    try {
      const { email } = req.query;

      if (!email) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      const isVerified = await otpRepository.isEmailVerified(email);

      res.json(successResponse(
        { 
          email,
          verified: isVerified
        },
        isVerified ? 'Email is verified' : 'Email is not verified'
      ));
    } catch (error) {
      console.error('Error checking verification status:', error);
      next(error);
    }
  }
}

export default new EmailVerificationController();
