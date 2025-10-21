import express from 'express';
import emailVerificationController from '../controllers/emailVerificationController.js';

const router = express.Router();

// Send OTP to email
router.post('/send-otp', emailVerificationController.sendOTP);

// Verify OTP
router.post('/verify-otp', emailVerificationController.verifyOTP);

// Resend OTP
router.post('/resend-otp', emailVerificationController.resendOTP);

// Check verification status
router.get('/status', emailVerificationController.checkVerificationStatus);

export default router;
