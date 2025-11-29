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
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// Signup routes - Step 1: Send OTP
router.post(stryMutAct_9fa48("2909") ? "" : (stryCov_9fa48("2909"), '/signup/learner'), authController.signupLearner);
router.post(stryMutAct_9fa48("2910") ? "" : (stryCov_9fa48("2910"), '/signup/admin'), authController.signupAdmin);

// Signup routes - Step 2: Verify OTP and complete signup
router.post(stryMutAct_9fa48("2911") ? "" : (stryCov_9fa48("2911"), '/signup/learner/verify'), authController.verifySignupLearner);
router.post(stryMutAct_9fa48("2912") ? "" : (stryCov_9fa48("2912"), '/signup/admin/verify'), authController.verifySignupAdmin);

// Login routes
router.post(stryMutAct_9fa48("2913") ? "" : (stryCov_9fa48("2913"), '/login/learner'), authController.loginLearner);
router.post(stryMutAct_9fa48("2914") ? "" : (stryCov_9fa48("2914"), '/login/admin'), authController.loginAdmin);

// Password reset routes
router.post(stryMutAct_9fa48("2915") ? "" : (stryCov_9fa48("2915"), '/forgot-password'), authController.forgotPassword);
router.post(stryMutAct_9fa48("2916") ? "" : (stryCov_9fa48("2916"), '/verify-reset-otp'), authController.verifyResetOTP);
router.post(stryMutAct_9fa48("2917") ? "" : (stryCov_9fa48("2917"), '/reset-password'), authController.resetPassword);

// OTP management
router.post(stryMutAct_9fa48("2918") ? "" : (stryCov_9fa48("2918"), '/resend-otp'), authController.resendOTP);

// Password suggestions
router.get(stryMutAct_9fa48("2919") ? "" : (stryCov_9fa48("2919"), '/password-suggestions'), authController.getPasswordSuggestions);

// Protected profile routes
router.get(stryMutAct_9fa48("2920") ? "" : (stryCov_9fa48("2920"), '/profile'), authMiddleware, authController.getProfile);
router.put(stryMutAct_9fa48("2921") ? "" : (stryCov_9fa48("2921"), '/profile'), authMiddleware, authController.updateProfile);
router.patch(stryMutAct_9fa48("2922") ? "" : (stryCov_9fa48("2922"), '/profile'), authMiddleware, authController.updateProfile);
export default router;