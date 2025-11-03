import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Admin API Client
 * API functions for admin content management
 */

// ==================== Language Operations ====================

/**
 * Get all unique languages
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getLanguages = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/languages`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get all courses for a specific language
 * @param {string} language - Language name
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getCoursesByLanguage = async (language) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/languages/${language}/courses`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

// ==================== Course Operations ====================

/**
 * Create a new course
 * @param {Object} courseData - Course data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const createCourse = async (courseData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(courseData),
  });
  
  return handleResponse(response);
};

/**
 * Get course details with units and lessons
 * @param {number} courseId - Course ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getCourseDetails = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Update a course
 * @param {number} courseId - Course ID
 * @param {Object} courseData - Course data to update
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const updateCourse = async (courseId, courseData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(courseData),
  });
  
  return handleResponse(response);
};

/**
 * Delete a course
 * @param {number} courseId - Course ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

// ==================== Unit Operations ====================

/**
 * Create a new unit
 * @param {number} courseId - Course ID
 * @param {Object} unitData - Unit data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const createUnit = async (courseId, unitData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}/units`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(unitData),
  });
  
  return handleResponse(response);
};

/**
 * Update a unit
 * @param {number} unitId - Unit ID
 * @param {Object} unitData - Unit data to update
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const updateUnit = async (unitId, unitData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(unitData),
  });
  
  return handleResponse(response);
};

/**
 * Delete a unit
 * @param {number} unitId - Unit ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const deleteUnit = async (unitId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

// ==================== Lesson Operations ====================

/**
 * Create a new lesson
 * @param {number} unitId - Unit ID
 * @param {Object} lessonData - Lesson data
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const createLesson = async (unitId, lessonData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}/lessons`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(lessonData),
  });
  
  return handleResponse(response);
};

/**
 * Update a lesson
 * @param {number} lessonId - Lesson ID
 * @param {Object} lessonData - Lesson data to update
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const updateLesson = async (lessonId, lessonData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(lessonData),
  });
  
  return handleResponse(response);
};

/**
 * Delete a lesson
 * @param {number} lessonId - Lesson ID
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const deleteLesson = async (lessonId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

<<<<<<< HEAD
// ==================== Analytics Operations ====================

/**
 * Get comprehensive platform analytics
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics`, {
    headers: getAuthHeader(),
  });
  
=======
// ==================== User Management (Admin) ====================

/**
 * Get learners (admin)
 */
export const getLearners = async ({ search = '', page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));
  params.set('limit', String(limit));
  const response = await fetch(`${API_BASE_URL}/api/admin/users?${params.toString()}`, {
    headers: getAuthHeader(),
  });
>>>>>>> 3e7413f (auth changes)
  return handleResponse(response);
};

/**
<<<<<<< HEAD
 * Get analytics for a specific time period
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getAnalyticsForPeriod = async (days = 30) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/period?days=${days}`, {
    headers: getAuthHeader(),
  });
  
=======
 * Get learner details (admin)
 */
export const getLearnerDetails = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    headers: getAuthHeader(),
  });
>>>>>>> 3e7413f (auth changes)
  return handleResponse(response);
};

/**
<<<<<<< HEAD
 * Get language distribution statistics
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getLanguageDistribution = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/languages`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get module usage statistics (Admin vs AI)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getModuleUsage = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/modules`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get user engagement metrics
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getUserEngagement = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/engagement`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get lesson completion trends
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getLessonCompletionTrends = async (days = 30) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/trends?days=${days}`, {
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};
=======
 * Update learner (admin)
 */
export const updateLearner = async (userId, { name, email }) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify({ name, email }),
  });
  return handleResponse(response);
};
>>>>>>> 3e7413f (auth changes)
