import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Signup routes - Step 1: Send OTP
router.post('/signup/learner', authController.signupLearner);
router.post('/signup/admin', authController.signupAdmin);

// Signup routes - Step 2: Verify OTP and complete signup
router.post('/signup/learner/verify', authController.verifySignupLearner);
router.post('/signup/admin/verify', authController.verifySignupAdmin);

// Login routes
router.post('/login/learner', authController.loginLearner);
router.post('/login/admin', authController.loginAdmin);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-otp', authController.verifyResetOTP);
router.post('/reset-password', authController.resetPassword);

// OTP management
router.post('/resend-otp', authController.resendOTP);

// Password suggestions
router.get('/password-suggestions', authController.getPasswordSuggestions);

// Protected profile routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;
