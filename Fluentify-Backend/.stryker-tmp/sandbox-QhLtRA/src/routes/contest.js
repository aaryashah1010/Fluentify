// @ts-nocheck
import express from 'express';
import authMiddleware, { adminOnly } from '../middlewares/authMiddleware.js';
import contestController from '../controllers/contestController.js';

const router = express.Router();

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   POST /api/contests/admin
 * @desc    Create a new contest
 * @access  Admin only
 */
router.post('/admin', authMiddleware, adminOnly, contestController.handleAdminCreateContest);

/**
 * @route   POST /api/contests/admin/:contestId/questions
 * @desc    Add a question to a contest
 * @access  Admin only
 */
router.post('/admin/:contestId/questions', authMiddleware, adminOnly, contestController.handleAdminAddQuestion);

/**
 * @route   PUT /api/contests/admin/:contestId
 * @desc    Update contest details
 * @access  Admin only
 */
router.put('/admin/:contestId', authMiddleware, adminOnly, contestController.handleAdminUpdateContest);

/**
 * @route   PATCH /api/contests/admin/:contestId/publish
 * @desc    Publish a contest
 * @access  Admin only
 */
router.patch('/admin/:contestId/publish', authMiddleware, adminOnly, contestController.handleAdminPublishContest);

/**
 * @route   GET /api/contests/admin
 * @desc    Get all contests (admin view)
 * @access  Admin only
 */
router.get('/admin', authMiddleware, adminOnly, contestController.handleAdminGetContests);

/**
 * @route   GET /api/contests/admin/:contestId
 * @desc    Get contest details with questions (admin view)
 * @access  Admin only
 */
router.get('/admin/:contestId', authMiddleware, adminOnly, contestController.handleAdminGetContestDetails);

/**
 * @route   DELETE /api/contests/admin/:contestId
 * @desc    Delete a contest
 * @access  Admin only
 */
router.delete('/admin/:contestId', authMiddleware, adminOnly, contestController.handleAdminDeleteContest);

// ============================================
// LEARNER ROUTES
// ============================================

/**
 * @route   GET /api/contests/my-contests
 * @desc    Get user's contest history
 * @access  Authenticated learners
 */
router.get('/my-contests', authMiddleware, contestController.handleGetUserContestHistory);

/**
 * @route   GET /api/contests
 * @desc    Get all available contests for learners
 * @access  Authenticated learners
 */
router.get('/', authMiddleware, contestController.handleGetAvailableContests);

/**
 * @route   GET /api/contests/:contestId
 * @desc    Get contest details for participation
 * @access  Authenticated learners
 */
router.get('/:contestId', authMiddleware, contestController.handleGetContestDetails);

/**
 * @route   POST /api/contests/:contestId/submit
 * @desc    Submit contest answers
 * @access  Authenticated learners
 */
router.post('/:contestId/submit', authMiddleware, contestController.handleSubmitContest);

/**
 * @route   GET /api/contests/:contestId/leaderboard
 * @desc    Get leaderboard for a contest
 * @access  Authenticated users
 */
router.get('/:contestId/leaderboard', authMiddleware, contestController.handleGetLeaderboard);

/**
 * @route   GET /api/contests/:contestId/my-result
 * @desc    Get user's result for a specific contest
 * @access  Authenticated learners
 */
router.get('/:contestId/my-result', authMiddleware, contestController.handleGetUserContestDetails);

export default router;
