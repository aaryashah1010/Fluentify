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
import tutorController from '../controllers/tutorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { chatRateLimit } from '../middlewares/rateLimitMiddleware.js';
const router = express.Router();

// All tutor routes require authentication
router.use(authMiddleware);

// Health check endpoint
router.get(stryMutAct_9fa48("2960") ? "" : (stryCov_9fa48("2960"), '/health'), tutorController.healthCheck);

// Chat endpoints
router.post(stryMutAct_9fa48("2961") ? "" : (stryCov_9fa48("2961"), '/message'), chatRateLimit, tutorController.sendMessage);
router.get(stryMutAct_9fa48("2962") ? "" : (stryCov_9fa48("2962"), '/history'), tutorController.getChatHistory);
router.post(stryMutAct_9fa48("2963") ? "" : (stryCov_9fa48("2963"), '/session'), tutorController.createSession);
export default router;