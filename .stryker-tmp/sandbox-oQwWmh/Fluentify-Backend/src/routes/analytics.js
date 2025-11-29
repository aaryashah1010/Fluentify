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
import analyticsController from '../controllers/analyticsController.js';
const router = express.Router();

// Note: Authentication and admin check are handled by parent admin routes

/**
 * @route GET /api/admin/analytics
 * @desc Get comprehensive platform analytics
 * @access Admin only
 */
router.get(stryMutAct_9fa48("2903") ? "" : (stryCov_9fa48("2903"), '/'), analyticsController.getPlatformAnalytics);

/**
 * @route GET /api/admin/analytics/period
 * @desc Get analytics for a specific time period
 * @query days - Number of days to look back (default: 30)
 * @access Admin only
 */
router.get(stryMutAct_9fa48("2904") ? "" : (stryCov_9fa48("2904"), '/period'), analyticsController.getAnalyticsForPeriod);

/**
 * @route GET /api/admin/analytics/languages
 * @desc Get language distribution statistics
 * @access Admin only
 */
router.get(stryMutAct_9fa48("2905") ? "" : (stryCov_9fa48("2905"), '/languages'), analyticsController.getLanguageDistribution);

/**
 * @route GET /api/admin/analytics/modules
 * @desc Get module usage statistics (Admin vs AI)
 * @access Admin only
 */
router.get(stryMutAct_9fa48("2906") ? "" : (stryCov_9fa48("2906"), '/modules'), analyticsController.getModuleUsage);

/**
 * @route GET /api/admin/analytics/engagement
 * @desc Get user engagement metrics
 * @access Admin only
 */
router.get(stryMutAct_9fa48("2907") ? "" : (stryCov_9fa48("2907"), '/engagement'), analyticsController.getUserEngagement);

/**
 * @route GET /api/admin/analytics/trends
 * @desc Get lesson completion trends
 * @query days - Number of days to look back (default: 30)
 * @access Admin only
 */
router.get(stryMutAct_9fa48("2908") ? "" : (stryCov_9fa48("2908"), '/trends'), analyticsController.getLessonCompletionTrends);
export default router;