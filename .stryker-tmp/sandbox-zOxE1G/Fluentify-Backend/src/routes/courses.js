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
import courseController from '../controllers/courseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// ==================== PUBLIC ROUTES (No Authentication Required) ====================
// Get all languages with published courses
router.get(stryMutAct_9fa48("2936") ? "" : (stryCov_9fa48("2936"), '/public/languages'), courseController.getPublishedLanguages);

// Get published courses for a specific language
router.get(stryMutAct_9fa48("2937") ? "" : (stryCov_9fa48("2937"), '/public/languages/:language/courses'), courseController.getPublishedCoursesByLanguage);

// Get published course details with units and lessons
router.get(stryMutAct_9fa48("2938") ? "" : (stryCov_9fa48("2938"), '/public/courses/:courseId'), courseController.getPublishedCourseDetails);

// ==================== PROTECTED ROUTES (Authentication Required) ====================
// All course routes below require authentication
router.use(authMiddleware);

// Generate a new course (streaming with SSE)
router.get(stryMutAct_9fa48("2939") ? "" : (stryCov_9fa48("2939"), '/generate-stream'), courseController.generateCourseStream);

// Generate a new course (legacy - non-streaming)
router.post(stryMutAct_9fa48("2940") ? "" : (stryCov_9fa48("2940"), '/generate'), courseController.generateCourse);

// Get learner's courses
router.get(stryMutAct_9fa48("2941") ? "" : (stryCov_9fa48("2941"), '/'), courseController.getLearnerCourses);

// Get specific course details with progress
router.get(stryMutAct_9fa48("2942") ? "" : (stryCov_9fa48("2942"), '/:courseId'), courseController.getCourseDetails);

// Delete a course and all related data
router.delete(stryMutAct_9fa48("2943") ? "" : (stryCov_9fa48("2943"), '/:courseId'), courseController.deleteCourse);

// Get specific lesson details (with unit ID)
router.get(stryMutAct_9fa48("2944") ? "" : (stryCov_9fa48("2944"), '/:courseId/units/:unitId/lessons/:lessonId'), courseController.getLessonDetails);

// Generate exercises for a lesson
router.post(stryMutAct_9fa48("2945") ? "" : (stryCov_9fa48("2945"), '/:courseId/units/:unitId/lessons/:lessonId/exercises/generate'), courseController.generateLessonExercises);

// Get specific lesson details (backward compatible - without unit ID in URL)
router.get(stryMutAct_9fa48("2946") ? "" : (stryCov_9fa48("2946"), '/:courseId/lessons/:lessonId'), courseController.getLessonDetailsLegacy);

// Mark lesson as complete (backward compatible - without unit ID in URL)
router.post(stryMutAct_9fa48("2947") ? "" : (stryCov_9fa48("2947"), '/:courseId/lessons/:lessonId/complete'), courseController.completeLessonLegacy);
export default router;