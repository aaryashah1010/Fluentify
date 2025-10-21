/**
 * Forgot Password Controller
 * Handles password reset functionality with email verification
 */

import bcrypt from 'bcrypt';
import { validateEmail } from '../utils/emailValidator.js';
import { validatePassword, validatePasswordMatch } from '../utils/passwordValidator.js';
import { generateOTP, generateOTPExpiry, isOTPValid, sendOTPEmail } from '../services/otpService.js';
import otpRepository from '../repositories/otpRepository.js';
import authRepository from '../repositories/authRepository.js';
import { ERRORS } from '../utils/error.js';
import { successResponse } from '../utils/response.js';

class ForgotPasswordController {
  /**
   * Step 1: Send OTP to email for password reset
   */
  async sendResetOTP(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate email format
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        if (emailValidation.isDisposable) {
          throw ERRORS.DISPOSABLE_EMAIL;
        }
        throw ERRORS.INVALID_EMAIL;
      }

      // Check if user exists
      const learner = await authRepository.findLearnerByEmail(email);
      const admin = await authRepository.findAdminByEmail(email);
      
      if (!learner && !admin) {
        throw ERRORS.USER_NOT_FOUND;
      }

      // Check if email has exceeded daily OTP limit
      const hasExceededLimit = await otpRepository.hasExceededOTPLimit(email);
      if (hasExceededLimit) {
        const error = { ...ERRORS.OTP_RATE_LIMIT };
        error.details = {
          message: 'Maximum OTP generation limit reached (3 per day). Please try again tomorrow.'
        };
        throw error;
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

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = generateOTPExpiry();

      // Store OTP
      await otpRepository.createOTP(email, otp, expiresAt);

      // Send OTP via email
      const userName = learner?.name || admin?.name || 'User';
      const emailSent = await sendOTPEmail(email, otp, userName);
      if (!emailSent) {
        throw ERRORS.OTP_SEND_FAILED;
      }

      res.json(successResponse(
        { 
          email,
          expiresIn: 120 // 2 minutes
        },
        'Password reset OTP sent to your email'
      ));
    } catch (error) {
      console.error('Error sending reset OTP:', error);
      next(error);
    }
  }

  /**
   * Step 2: Verify OTP for password reset
   */
  async verifyResetOTP(req, res, next) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Get latest OTP
      const otpRecord = await otpRepository.getLatestOTP(email);

      if (!otpRecord) {
        throw ERRORS.INVALID_OTP;
      }

      // Check if OTP has expired
      if (!isOTPValid(otpRecord.expires_at)) {
        throw ERRORS.OTP_EXPIRED;
      }

      // Check max attempts
      if (otpRecord.attempts >= 3) {
        throw ERRORS.MAX_OTP_ATTEMPTS;
      }

      // Verify OTP
      if (otpRecord.otp !== otp) {
        await otpRepository.incrementAttempts(email);
        throw ERRORS.INVALID_OTP;
      }

      // Mark OTP as verified
      await otpRepository.verifyOTP(email, otp);

      res.json(successResponse(
        { 
          email,
          verified: true
        },
        'OTP verified successfully. You can now reset your password.'
      ));
    } catch (error) {
      console.error('Error verifying reset OTP:', error);
      next(error);
    }
  }

  /**
   * Step 3: Reset password after OTP verification
   */
  async resetPassword(req, res, next) {
    try {
      const { email, newPassword, confirmPassword } = req.body;

      if (!email || !newPassword || !confirmPassword) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Check if email has been verified via OTP
      const isVerified = await otpRepository.isEmailVerified(email);
      if (!isVerified) {
        throw ERRORS.EMAIL_NOT_VERIFIED;
      }

      // Validate password match
      const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
      if (!matchValidation.isValid) {
        const error = { ...ERRORS.WEAK_PASSWORD };
        error.details = {
          errors: matchValidation.errors
        };
        throw error;
      }

      // Validate password strength
      const passwordValidation = validatePassword(newPassword, email);
      if (!passwordValidation.isValid) {
        const error = { ...ERRORS.WEAK_PASSWORD };
        error.details = {
          errors: passwordValidation.errors,
          suggestions: passwordValidation.suggestions,
          requirements: passwordValidation.requirements
        };
        throw error;
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update password in database
      const learner = await authRepository.findLearnerByEmail(email);
      const admin = await authRepository.findAdminByEmail(email);

      if (learner) {
        await authRepository.updateLearnerPassword(email, passwordHash);
      } else if (admin) {
        await authRepository.updateAdminPassword(email, passwordHash);
      } else {
        throw ERRORS.USER_NOT_FOUND;
      }

      // Clean up OTP records
      await otpRepository.deleteOTPsForEmail(email);

      res.json(successResponse(
        { email },
        'Password reset successfully. You can now login with your new password.'
      ));
    } catch (error) {
      console.error('Error resetting password:', error);
      next(error);
    }
  }
}

export default new ForgotPasswordController();
