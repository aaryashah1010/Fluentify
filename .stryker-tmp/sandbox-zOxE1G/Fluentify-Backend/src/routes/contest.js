// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
router.post(stryMutAct_9fa48("2923") ? "" : (stryCov_9fa48("2923"), '/admin'), authMiddleware, adminOnly, contestController.handleAdminCreateContest);

/**
 * @route   POST /api/contests/admin/:contestId/questions
 * @desc    Add a question to a contest
 * @access  Admin only
 */
router.post(stryMutAct_9fa48("2924") ? "" : (stryCov_9fa48("2924"), '/admin/:contestId/questions'), authMiddleware, adminOnly, contestController.handleAdminAddQuestion);

/**
 * @route   PUT /api/contests/admin/:contestId
 * @desc    Update contest details
 * @access  Admin only
 */
router.put(stryMutAct_9fa48("2925") ? "" : (stryCov_9fa48("2925"), '/admin/:contestId'), authMiddleware, adminOnly, contestController.handleAdminUpdateContest);

/**
 * @route   PATCH /api/contests/admin/:contestId/publish
 * @desc    Publish a contest
 * @access  Admin only
 */
router.patch(stryMutAct_9fa48("2926") ? "" : (stryCov_9fa48("2926"), '/admin/:contestId/publish'), authMiddleware, adminOnly, contestController.handleAdminPublishContest);

/**
 * @route   GET /api/contests/admin
 * @desc    Get all contests (admin view)
 * @access  Admin only
 */
router.get(stryMutAct_9fa48("2927") ? "" : (stryCov_9fa48("2927"), '/admin'), authMiddleware, adminOnly, contestController.handleAdminGetContests);

/**
 * @route   GET /api/contests/admin/:contestId
 * @desc    Get contest details with questions (admin view)
 * @access  Admin only
 */
router.get(stryMutAct_9fa48("2928") ? "" : (stryCov_9fa48("2928"), '/admin/:contestId'), authMiddleware, adminOnly, contestController.handleAdminGetContestDetails);

/**
 * @route   DELETE /api/contests/admin/:contestId
 * @desc    Delete a contest
 * @access  Admin only
 */
router.delete(stryMutAct_9fa48("2929") ? "" : (stryCov_9fa48("2929"), '/admin/:contestId'), authMiddleware, adminOnly, contestController.handleAdminDeleteContest);

// ============================================
// LEARNER ROUTES
// ============================================

/**
 * @route   GET /api/contests/my-contests
 * @desc    Get user's contest history
 * @access  Authenticated learners
 */
router.get(stryMutAct_9fa48("2930") ? "" : (stryCov_9fa48("2930"), '/my-contests'), authMiddleware, contestController.handleGetUserContestHistory);

/**
 * @route   GET /api/contests
 * @desc    Get all available contests for learners
 * @access  Authenticated learners
 */
router.get(stryMutAct_9fa48("2931") ? "" : (stryCov_9fa48("2931"), '/'), authMiddleware, contestController.handleGetAvailableContests);

/**
 * @route   GET /api/contests/:contestId
 * @desc    Get contest details for participation
 * @access  Authenticated learners
 */
router.get(stryMutAct_9fa48("2932") ? "" : (stryCov_9fa48("2932"), '/:contestId'), authMiddleware, contestController.handleGetContestDetails);

/**
 * @route   POST /api/contests/:contestId/submit
 * @desc    Submit contest answers
 * @access  Authenticated learners
 */
router.post(stryMutAct_9fa48("2933") ? "" : (stryCov_9fa48("2933"), '/:contestId/submit'), authMiddleware, contestController.handleSubmitContest);

/**
 * @route   GET /api/contests/:contestId/leaderboard
 * @desc    Get leaderboard for a contest
 * @access  Authenticated users
 */
router.get(stryMutAct_9fa48("2934") ? "" : (stryCov_9fa48("2934"), '/:contestId/leaderboard'), authMiddleware, contestController.handleGetLeaderboard);

/**
 * @route   GET /api/contests/:contestId/my-result
 * @desc    Get user's result for a specific contest
 * @access  Authenticated learners
 */
router.get(stryMutAct_9fa48("2935") ? "" : (stryCov_9fa48("2935"), '/:contestId/my-result'), authMiddleware, contestController.handleGetUserContestDetails);
export default router;