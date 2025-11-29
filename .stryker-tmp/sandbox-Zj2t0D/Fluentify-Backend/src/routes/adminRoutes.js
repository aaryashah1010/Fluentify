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
import { body } from 'express-validator';
import authMiddleware, { adminOnly } from '../middlewares/authMiddleware.js';
import moduleAdminController from '../controllers/moduleAdminController.js';
import userManagementController from '../controllers/userManagementController.js';
import analyticsRoutes from './analytics.js';
import adminUserController from '../controllers/adminUserController.js';
import emailCampaignController from '../controllers/emailCampaignController.js';
const router = express.Router();

// Protect all routes below with authentication and admin check
router.use(authMiddleware, adminOnly);

// ==================== User Management Routes ====================
// Get all users with pagination
router.get(stryMutAct_9fa48("2874") ? "" : (stryCov_9fa48("2874"), '/users'), userManagementController.getAllUsers);

// Search users by name or email
router.get(stryMutAct_9fa48("2875") ? "" : (stryCov_9fa48("2875"), '/users/search'), userManagementController.searchUsers);

// Get user details and progress
router.get(stryMutAct_9fa48("2876") ? "" : (stryCov_9fa48("2876"), '/users/:userId'), userManagementController.getUserDetails);

// Update user profile
router.put(stryMutAct_9fa48("2877") ? "" : (stryCov_9fa48("2877"), '/users/:userId'), stryMutAct_9fa48("2878") ? [] : (stryCov_9fa48("2878"), [stryMutAct_9fa48("2879") ? body('name').optional().isLength({
  min: 2
}) : (stryCov_9fa48("2879"), body(stryMutAct_9fa48("2880") ? "" : (stryCov_9fa48("2880"), 'name')).optional().trim().isLength(stryMutAct_9fa48("2881") ? {} : (stryCov_9fa48("2881"), {
  min: 2
}))), body(stryMutAct_9fa48("2882") ? "" : (stryCov_9fa48("2882"), 'email')).optional().isEmail().normalizeEmail()]), userManagementController.updateUser);

// Delete user
router.delete(stryMutAct_9fa48("2883") ? "" : (stryCov_9fa48("2883"), '/users/:userId'), userManagementController.deleteUser);

// ==================== Language Routes (Read-only) ====================
// Get list of unique languages
router.get(stryMutAct_9fa48("2884") ? "" : (stryCov_9fa48("2884"), '/languages'), moduleAdminController.getLanguages);

// Get courses for a specific language
router.get(stryMutAct_9fa48("2885") ? "" : (stryCov_9fa48("2885"), '/languages/:lang/courses'), moduleAdminController.getCoursesByLanguage);

// ==================== Course (Module) Routes ====================
// Create a new course
router.post(stryMutAct_9fa48("2886") ? "" : (stryCov_9fa48("2886"), '/courses'), moduleAdminController.createCourse);

// Get a single course with units and lessons
router.get(stryMutAct_9fa48("2887") ? "" : (stryCov_9fa48("2887"), '/courses/:courseId'), moduleAdminController.getCourseDetails);

// Update a course
router.put(stryMutAct_9fa48("2888") ? "" : (stryCov_9fa48("2888"), '/courses/:courseId'), moduleAdminController.updateCourse);

// Delete a course
router.delete(stryMutAct_9fa48("2889") ? "" : (stryCov_9fa48("2889"), '/courses/:courseId'), moduleAdminController.deleteCourse);

// ==================== Unit (Volume) Routes ====================
// Add a unit to a course
router.post(stryMutAct_9fa48("2890") ? "" : (stryCov_9fa48("2890"), '/courses/:courseId/units'), moduleAdminController.createUnit);

// Update a unit
router.put(stryMutAct_9fa48("2891") ? "" : (stryCov_9fa48("2891"), '/units/:unitId'), moduleAdminController.updateUnit);

// Delete a unit
router.delete(stryMutAct_9fa48("2892") ? "" : (stryCov_9fa48("2892"), '/units/:unitId'), moduleAdminController.deleteUnit);

// ==================== Lesson Routes ====================
// Add a lesson to a unit
router.post(stryMutAct_9fa48("2893") ? "" : (stryCov_9fa48("2893"), '/units/:unitId/lessons'), moduleAdminController.createLesson);

// Update a lesson
router.put(stryMutAct_9fa48("2894") ? "" : (stryCov_9fa48("2894"), '/lessons/:lessonId'), moduleAdminController.updateLesson);

// Delete a lesson
router.delete(stryMutAct_9fa48("2895") ? "" : (stryCov_9fa48("2895"), '/lessons/:lessonId'), moduleAdminController.deleteLesson);

// ==================== Analytics Routes ====================
// Analytics routes (already protected by admin middleware)
router.use(stryMutAct_9fa48("2896") ? "" : (stryCov_9fa48("2896"), '/analytics'), analyticsRoutes);

// ==================== Email Campaign Routes ====================
// Get all learners for email campaign
router.get(stryMutAct_9fa48("2897") ? "" : (stryCov_9fa48("2897"), '/email-campaign/learners'), emailCampaignController.getLearnersForCampaign);

// Export learners as CSV
router.get(stryMutAct_9fa48("2898") ? "" : (stryCov_9fa48("2898"), '/email-campaign/export-csv'), emailCampaignController.exportLearnersCSV);

// Trigger n8n email campaign webhook
router.post(stryMutAct_9fa48("2899") ? "" : (stryCov_9fa48("2899"), '/email-campaign/trigger'), emailCampaignController.triggerEmailCampaign);

// ==================== Admin User Management ====================
router.get(stryMutAct_9fa48("2900") ? "" : (stryCov_9fa48("2900"), '/users'), adminUserController.listLearners);
router.get(stryMutAct_9fa48("2901") ? "" : (stryCov_9fa48("2901"), '/users/:id'), adminUserController.getLearnerDetails);
router.put(stryMutAct_9fa48("2902") ? "" : (stryCov_9fa48("2902"), '/users/:id'), adminUserController.updateLearner);
export default router;