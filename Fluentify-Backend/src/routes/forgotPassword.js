import express from 'express';
import forgotPasswordController from '../controllers/forgotPasswordController.js';

const router = express.Router();

// Send OTP for password reset
router.post('/send-otp', forgotPasswordController.sendResetOTP);

// Verify OTP for password reset
router.post('/verify-otp', forgotPasswordController.verifyResetOTP);

// Reset password after OTP verification
router.post('/reset-password', forgotPasswordController.resetPassword);

export default router;
