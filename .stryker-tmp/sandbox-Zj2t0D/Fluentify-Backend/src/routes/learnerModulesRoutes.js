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
import authMiddleware from '../middlewares/authMiddleware.js';
import moduleAdminController from '../controllers/moduleAdminController.js';
const router = express.Router();

// Protect all routes below with authentication (learner only, no admin check)
router.use(authMiddleware);

// ==================== Language Routes (Read-only for learners) ====================
// Get list of unique published languages
router.get(stryMutAct_9fa48("2948") ? "" : (stryCov_9fa48("2948"), '/languages'), moduleAdminController.getPublishedLanguages);

// Get published courses for a specific language
router.get(stryMutAct_9fa48("2949") ? "" : (stryCov_9fa48("2949"), '/languages/:lang/courses'), moduleAdminController.getPublishedCoursesByLanguage);

// ==================== Course (Module) Routes (Read-only for learners) ====================
// Get a single published course with units and lessons
router.get(stryMutAct_9fa48("2950") ? "" : (stryCov_9fa48("2950"), '/courses/:courseId'), moduleAdminController.getPublishedCourseDetails);
export default router;