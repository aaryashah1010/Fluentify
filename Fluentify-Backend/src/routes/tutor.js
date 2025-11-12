import express from 'express';
import tutorController from '../controllers/tutorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { chatRateLimit } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

// All tutor routes require authentication
router.use(authMiddleware);

// Health check endpoint
router.get('/health', tutorController.healthCheck);

// Chat endpoints
router.post('/message', chatRateLimit, tutorController.sendMessage);
router.get('/history', tutorController.getChatHistory);
router.post('/session', tutorController.createSession);
router.get('/session/:sessionId/messages', tutorController.getSessionMessages);

export default router;
