// @ts-nocheck
import bcrypt from 'bcrypt';
import authRepository from '../repositories/authRepository.js';
import { createAuthToken } from '../utils/jwt.js';
import { authResponse, successResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';
import emailService from '../utils/emailService.js';
import { validateName, validateEmail, validatePassword, validateOTP, generatePasswordSuggestions } from '../utils/validation.js';

class AuthController {
  /**
   * Initiate signup for learners - Send OTP
   */
  async signupLearner(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate name
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: nameValidation.errors.join(', ')
        });
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.errors.join(', ')
        });
      }

      // Validate password
      const passwordValidation = validatePassword(password, email, name);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: passwordValidation.errors.join(', '),
          suggestions: generatePasswordSuggestions(3)
        });
      }

      // Check if email already exists
      const existingUser = await authRepository.findLearnerByEmail(email);
      if (existingUser) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
      }

      // Generate and store OTP
      const otp = emailService.generateOTP();
      await authRepository.storeOTP(email, otp, 'signup', 'learner');

      // Send OTP email
      await emailService.sendSignupOTP(email, name, otp);

      res.json(successResponse(
        { email, message: 'OTP sent to your email' },
        'Please verify your email with the OTP sent'
      ));
    } catch (error) {
      console.error('Error in learner signup:', error);
      next(error);
    }
  }

  /**
   * Verify OTP and complete signup for learners
   */
  async verifySignupLearner(req, res, next) {
    try {
      const { name, email, password, otp } = req.body;

      if (!name || !email || !password || !otp) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate OTP format
      const otpValidation = validateOTP(otp);
      if (!otpValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: otpValidation.errors.join(', ')
        });
      }

      // Verify OTP
      const otpRecord = await authRepository.verifyOTP(email, otp, 'signup', 'learner');
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Check if email already exists
      const existingUser = await authRepository.findLearnerByEmail(email);
      if (existingUser) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Start transaction
      await authRepository.beginTransaction();

      try {
        // Create learner
        const learner = await authRepository.createLearner(name, email, passwordHash);

        // Mark email as verified
        await authRepository.markLearnerEmailVerified(email);

        // Mark OTP as used
        await authRepository.markOTPAsUsed(otpRecord.id);

        // Set has_preferences to false for new users
        const user = { ...learner, has_preferences: false, is_email_verified: true };
        const token = createAuthToken({
          id: user.id,
          email: user.email,
          role: 'learner',
          hasPreferences: false
        });

        await authRepository.commitTransaction();

        // Send welcome email (non-blocking)
        emailService.sendWelcomeEmail(email, name).catch(err => 
          console.error('Failed to send welcome email:', err)
        );

        res.json(authResponse({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            hasPreferences: false,
            isEmailVerified: true
          },
          token
        }, 'Signup successful'));
      } catch (err) {
        await authRepository.rollbackTransaction();
        throw err;
      }
    } catch (error) {
      console.error('Error in learner signup verification:', error);
      next(error);
    }
  }

  /**
   * Initiate signup for admins - Send OTP
   */
  async signupAdmin(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate name
      const nameValidation = validateName(name);
      if (!nameValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: nameValidation.errors.join(', ')
        });
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.errors.join(', ')
        });
      }

      // Validate password
      const passwordValidation = validatePassword(password, email, name);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: passwordValidation.errors.join(', '),
          suggestions: generatePasswordSuggestions(3)
        });
      }

      // Check if email already exists
      const existingAdmin = await authRepository.findAdminByEmail(email);
      if (existingAdmin) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
      }

      // Generate and store OTP
      const otp = emailService.generateOTP();
      await authRepository.storeOTP(email, otp, 'signup', 'admin');

      // Send OTP email
      await emailService.sendSignupOTP(email, name, otp);

      res.json(successResponse(
        { email, message: 'OTP sent to your email' },
        'Please verify your email with the OTP sent'
      ));
    } catch (error) {
      console.error('Error in admin signup:', error);
      next(error);
    }
  }

  /**
   * Verify OTP and complete signup for admins
   */
  async verifySignupAdmin(req, res, next) {
    try {
      const { name, email, password, otp } = req.body;

      if (!name || !email || !password || !otp) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate OTP format
      const otpValidation = validateOTP(otp);
      if (!otpValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: otpValidation.errors.join(', ')
        });
      }

      // Verify OTP
      const otpRecord = await authRepository.verifyOTP(email, otp, 'signup', 'admin');
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Check if email already exists
      const existingAdmin = await authRepository.findAdminByEmail(email);
      if (existingAdmin) {
        throw ERRORS.EMAIL_ALREADY_EXISTS;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create admin
      const admin = await authRepository.createAdmin(name, email, passwordHash);

      // Mark email as verified
      await authRepository.markAdminEmailVerified(email);

      // Mark OTP as used
      await authRepository.markOTPAsUsed(otpRecord.id);

      const token = createAuthToken({
        id: admin.id,
        email: admin.email,
        role: 'admin'
      });

      // Send welcome email (non-blocking)
      emailService.sendWelcomeEmail(email, name).catch(err => 
        console.error('Failed to send welcome email:', err)
      );

      res.json(authResponse({
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          isEmailVerified: true
        },
        token
      }, 'Admin signup successful'));
    } catch (error) {
      console.error('Error in admin signup verification:', error);
      next(error);
    }
  }

  /**
   * Login for learners
   * FIX: Provides specific error messages for better UX
   */
  async loginLearner(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Find user
      const user = await authRepository.findLearnerByEmail(email);
      
      // FIX: Specific error when email not registered
      if (!user) {
        throw ERRORS.EMAIL_NOT_REGISTERED_LEARNER;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      // FIX: Specific error for incorrect password
      if (!isPasswordValid) {
        throw ERRORS.INCORRECT_PASSWORD;
      }

      // Generate token
      const token = createAuthToken({
        id: user.id,
        email: user.email,
        role: 'learner',
        hasPreferences: user.has_preferences
      });

      res.json(authResponse({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          hasPreferences: user.has_preferences
        },
        token
      }, 'Login successful'));
    } catch (error) {
      console.error('Error in learner login:', error);
      next(error);
    }
  }

  /**
   * Login for admins
   * FIX: Provides specific error messages for better UX
   */
  async loginAdmin(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Find admin
      const admin = await authRepository.findAdminByEmail(email);
      
      // FIX: Specific error when email not registered as admin
      if (!admin) {
        throw ERRORS.EMAIL_NOT_REGISTERED_ADMIN;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
      
      // FIX: Specific error for incorrect password
      if (!isPasswordValid) {
        throw ERRORS.INCORRECT_PASSWORD;
      }

      // Generate token
      const token = createAuthToken({
        id: admin.id,
        email: admin.email,
        role: 'admin'
      });

      res.json(authResponse({
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        },
        token
      }, 'Admin login successful'));
    } catch (error) {
      console.error('Error in admin login:', error);
      next(error);
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res, next) {
    try {
      const { id, role } = req.user;
      
      // Get full profile based on role
      let profile;
      if (role === 'learner') {
        profile = await authRepository.getFullLearnerProfile(id);
      } else if (role === 'admin') {
        profile = await authRepository.getFullAdminProfile(id);
      } else {
        throw ERRORS.INVALID_AUTH_TOKEN;
      }

      if (!profile) {
        throw ERRORS.USER_NOT_FOUND;
      }

      res.json(successResponse({ user: profile }, 'Profile retrieved successfully'));
    } catch (error) {
      console.error('Error getting profile:', error);
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res, next) {
    try {
      const { id, role } = req.user;
      const { name, contest_name } = req.body;

      // At least one field must be provided
      if (!name && contest_name === undefined) {
        return res.status(400).json({
          success: false,
          message: 'At least one field (name or contest_name) is required'
        });
      }

      // Validate name if provided
      if (name !== undefined) {
        if (!name || !name.trim()) {
          return res.status(400).json({
            success: false,
            message: 'Name cannot be empty'
          });
        }

        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: nameValidation.errors.join(', ')
          });
        }
      }

      // Validate contest_name if provided
      if (contest_name !== undefined && contest_name !== null && contest_name.trim()) {
        if (contest_name.trim().length > 50) {
          return res.status(400).json({
            success: false,
            message: 'Contest name must be 50 characters or less'
          });
        }
      }

      // Update profile based on role
      let updatedProfile;
      if (role === 'learner') {
        const updates = {};
        if (name !== undefined) updates.name = name.trim();
        if (contest_name !== undefined) updates.contest_name = contest_name ? contest_name.trim() : null;
        
        updatedProfile = await authRepository.updateLearnerProfile(id, updates);
      } else if (role === 'admin') {
        if (contest_name !== undefined) {
          return res.status(400).json({
            success: false,
            message: 'Contest name is only available for learners'
          });
        }
        updatedProfile = await authRepository.updateAdminProfile(id, name.trim());
      } else {
        throw ERRORS.INVALID_AUTH_TOKEN;
      }

      if (!updatedProfile) {
        throw ERRORS.USER_NOT_FOUND;
      }

      // Send confirmation email (non-blocking)
      emailService
        .sendProfileUpdateConfirmation(updatedProfile.email, updatedProfile.name)
        .catch(err => console.error('Failed to send profile update confirmation:', err));

      res.json(successResponse({ user: updatedProfile }, 'Profile updated successfully'));
    } catch (error) {
      console.error('Error updating profile:', error);
      next(error);
    }
  }

  /**
   * Initiate forgot password - Send OTP
   */
  async forgotPassword(req, res, next) {
    try {
      const { email, role } = req.body;

      if (!email || !role) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.errors.join(', ')
        });
      }

      // Check if user exists
      let user;
      if (role === 'learner') {
        user = await authRepository.findLearnerByEmail(email);
      } else if (role === 'admin') {
        user = await authRepository.findAdminByEmail(email);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      if (!user) {
        // User doesn't exist - return error message
        return res.status(404).json({
          success: false,
          message: `No ${role} account found with this email. Please sign up first.`
        });
      }

      // Check if user's email is verified
      if (!user.is_email_verified) {
        return res.status(400).json({
          success: false,
          message: 'Email not verified. Please complete signup verification first.'
        });
      }

      // Generate and store OTP
      const otp = emailService.generateOTP();
      await authRepository.storeOTP(email, otp, 'password_reset', role);

      // Send OTP email
      console.log(`🔐 Sending password reset OTP for ${role}: ${email}`);
      await emailService.sendPasswordResetOTP(email, user.name, otp);

      res.json(successResponse(
        { email, message: 'OTP sent to your email' },
        'Password reset OTP sent successfully. Check your email.'
      ));
    } catch (error) {
      console.error('Error in forgot password:', error);
      next(error);
    }
  }

  /**
   * Verify OTP for password reset
   */
  async verifyResetOTP(req, res, next) {
    try {
      const { email, otp, role } = req.body;

      if (!email || !otp || !role) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate OTP format
      const otpValidation = validateOTP(otp);
      if (!otpValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: otpValidation.errors.join(', ')
        });
      }

      // Verify OTP
      const otpRecord = await authRepository.verifyOTP(email, otp, 'password_reset', role);
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      res.json(successResponse(
        { email, verified: true },
        'OTP verified successfully'
      ));
    } catch (error) {
      console.error('Error in verify reset OTP:', error);
      next(error);
    }
  }

  /**
   * Reset password after OTP verification
   */
  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword, confirmPassword, role } = req.body;

      if (!email || !otp || !newPassword || !confirmPassword || !role) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match'
        });
      }

      // Get user to validate password against name
      let user;
      if (role === 'learner') {
        user = await authRepository.findLearnerByEmail(email);
      } else if (role === 'admin') {
        user = await authRepository.findAdminByEmail(email);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword, email, user.name);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: passwordValidation.errors.join(', '),
          suggestions: generatePasswordSuggestions(3)
        });
      }

      // Verify OTP one more time
      const otpRecord = await authRepository.verifyOTP(email, otp, 'password_reset', role);
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      if (role === 'learner') {
        await authRepository.updateLearnerPassword(email, passwordHash);
      } else {
        await authRepository.updateAdminPassword(email, passwordHash);
      }

      // Mark OTP as used
      await authRepository.markOTPAsUsed(otpRecord.id);

      // Clean up all password reset OTPs for this email
      await authRepository.deleteOTPsByEmail(email, 'password_reset', role);

      res.json(successResponse(
        { message: 'Password reset successful' },
        'Your password has been reset successfully'
      ));
    } catch (error) {
      console.error('Error in reset password:', error);
      next(error);
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(req, res, next) {
    try {
      const { email, otpType, role, name } = req.body;

      if (!email || !otpType || !role) {
        throw ERRORS.MISSING_REQUIRED_FIELDS;
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: emailValidation.errors.join(', ')
        });
      }

      // For password reset, verify user exists and is verified
      if (otpType === 'password_reset') {
        let user;
        if (role === 'learner') {
          user = await authRepository.findLearnerByEmail(email);
        } else if (role === 'admin') {
          user = await authRepository.findAdminByEmail(email);
        }

        if (!user) {
          return res.status(404).json({
            success: false,
            message: `No ${role} account found with this email.`
          });
        }

        if (!user.is_email_verified) {
          return res.status(400).json({
            success: false,
            message: 'Email not verified. Please complete signup verification first.'
          });
        }
      }

      // Enforce 60-second resend cooldown
      const latest = await authRepository.getLatestOTP(email, otpType, role);
      if (latest) {
        const createdAt = new Date(latest.created_at).getTime();
        const elapsedMs = Date.now() - createdAt;
        const cooldownMs = 60 * 1000;
        if (elapsedMs < cooldownMs) {
          const remaining = Math.ceil((cooldownMs - elapsedMs) / 1000);
          return res.status(429).json({
            success: false,
            message: `Please wait ${remaining}s before requesting a new OTP.`
          });
        }
      }

      // Generate new OTP
      const otp = emailService.generateOTP();
      await authRepository.storeOTP(email, otp, otpType, role);

      // Send OTP based on type
      console.log(`🔄 Resending ${otpType} OTP to: ${email}`);
      
      if (otpType === 'signup') {
        await emailService.sendSignupOTP(email, name || 'User', otp);
      } else if (otpType === 'password_reset') {
        // Get user name
        let user;
        if (role === 'learner') {
          user = await authRepository.findLearnerByEmail(email);
        } else {
          user = await authRepository.findAdminByEmail(email);
        }
        await emailService.sendPasswordResetOTP(email, user?.name || 'User', otp);
      }

      console.log(`✅ OTP resent successfully to: ${email}`);

      res.json(successResponse(
        { message: 'OTP resent successfully' },
        'A new OTP has been sent to your email'
      ));
    } catch (error) {
      console.error('❌ Error in resend OTP:', error);
      console.error('   Details:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to resend OTP. Please try again.'
      });
    }
  }

  /**
   * Get password suggestions
   */
  async getPasswordSuggestions(req, res, next) {
    try {
      const suggestions = generatePasswordSuggestions(5);
      res.json(successResponse(
        { suggestions },
        'Password suggestions generated'
      ));
    } catch (error) {
      console.error('Error generating password suggestions:', error);
      next(error);
    }
  }
}

export default new AuthController();
