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
import preferencesController from '../controllers/preferencesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// All preferences routes require authentication
router.use(authMiddleware);

// Save learner preferences
router.post(stryMutAct_9fa48("2951") ? "" : (stryCov_9fa48("2951"), '/learner'), preferencesController.savePreferences);

// Get learner preferences
router.get(stryMutAct_9fa48("2952") ? "" : (stryCov_9fa48("2952"), '/learner'), preferencesController.getPreferences);

// Update learner preferences
router.put(stryMutAct_9fa48("2953") ? "" : (stryCov_9fa48("2953"), '/learner'), preferencesController.updatePreferences);

// Delete learner preferences
router.delete(stryMutAct_9fa48("2954") ? "" : (stryCov_9fa48("2954"), '/learner'), preferencesController.deletePreferences);
export default router;