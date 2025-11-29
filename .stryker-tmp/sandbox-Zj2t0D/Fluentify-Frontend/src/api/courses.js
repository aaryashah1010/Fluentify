// @ts-nocheck
import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Fetch all courses for the learner
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Generate a new course
 * @param {Object} courseData
 * @param {string} courseData.language - Language to learn
 * @param {string} courseData.expectedDuration - Expected duration
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const generateCourse = async ({ language, expectedDuration }) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/generate`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ language, expectedDuration }),
  });
  return handleResponse(response);
};

/**
 * Fetch course details with units and lessons
 * @param {number} courseId - Course ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchCourseDetails = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Fetch lesson details
 * @param {number} courseId - Course ID
 * @param {number} unitId - Unit ID
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchLessonDetails = async ({ courseId, unitId, lessonId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/units/${unitId}/lessons/${lessonId}`,
    {
      headers: getAuthHeader(),
    }
  );
  return handleResponse(response);
};

/**
 * Generate additional exercises for a lesson
 * @param {number} courseId - Course ID
 * @param {number} unitId - Unit ID
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const generateExercises = async ({ courseId, unitId, lessonId }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/units/${unitId}/lessons/${lessonId}/exercises/generate`,
    {
      method: 'POST',
      headers: getAuthHeader(),
    }
  );
  return handleResponse(response);
};

/**
 * Mark lesson as complete (uses backend's legacy completion route)
 * Backend route: POST /api/courses/:courseId/lessons/:lessonId/complete
 * It derives the unit internally and updates lesson/unit progress + stats.
 *
 * @param {number} courseId - Course ID
 * @param {number} unitId   - Unit ID (accepted for compatibility, not used in URL)
 * @param {number} lessonId - Lesson ID (course lesson number)
 * @param {Object} progressData - Progress data (score, exercises)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const completeLesson = async ({
  courseId,
  unitId, // kept for callers, but backend derives unit itself
  lessonId,
  score = 100,
  exercises = [],
}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}/complete`,
    {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ score, exercises }),
    }
  );
  return handleResponse(response);
};

/**
 * Delete a course
 * @param {number} courseId - Course ID to delete
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

// ==================== PUBLIC ENDPOINTS (No Authentication Required) ====================

/**
 * Get all languages with published courses (PUBLIC - No Auth Required)
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getPublishedLanguages = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses/public/languages`);
  return handleResponse(response);
};

/**
 * Get published courses for a specific language (PUBLIC - No Auth Required)
 * @param {string} language - Language name
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getPublishedCoursesByLanguage = async (language) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/public/languages/${language}/courses`
  );
  return handleResponse(response);
};

/**
 * Get published course details with units and lessons (PUBLIC - No Auth Required)
 * @param {number} courseId - Course ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getPublishedCourseDetails = async (courseId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/public/courses/${courseId}`
  );
  return handleResponse(response);
};

// ==================== AUTHENTICATED LEARNER ENDPOINTS ====================

/**
 * Fetch all published languages (learner view)
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const fetchPublishedLanguages = async () => {
  const response = await fetch(`${API_BASE_URL}/api/learner-modules/languages`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Fetch published courses for a specific language (learner view)
 * @param {string} language - Language name
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const fetchPublishedCoursesByLanguage = async (language) => {
  const response = await fetch(
    `${API_BASE_URL}/api/learner-modules/languages/${language}/courses`,
    {
      headers: getAuthHeader(),
    }
  );
  return handleResponse(response);
};

/**
 * Fetch published course details with units and lessons (learner view)
 * @param {number} courseId - Course ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchPublishedCourseDetails = async (courseId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/learner-modules/courses/${courseId}`,
    {
      headers: getAuthHeader(),
    }
  );
  return handleResponse(response);
};
