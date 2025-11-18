import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Admin API Client
 * API functions for admin content and user management
 */

// ==================== User Management ====================

/**
 * Get all users with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20)
 * @returns {Promise<{success: boolean, data: {users: Array, pagination: Object}}>}
 */
export const getUsers = async (page = 1, limit = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users?page=${page}&limit=${limit}`,
    { headers: getAuthHeader() }
  );
  return handleResponse(response);
};

/**
 * Search users by name or email
 * @param {string} query - Search term
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const searchUsers = async (query) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/search?q=${encodeURIComponent(query)}`,
    { headers: getAuthHeader() }
  );
  return handleResponse(response);
};

/**
 * Get user details with progress
 * @param {number} userId - User ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const getUserDetails = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/${userId}`,
    { headers: getAuthHeader() }
  );
  return handleResponse(response);
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<{success: boolean, message: string, data: Object}>}
 */
export const updateUser = async (userId, userData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(userData),
    }
  );
  return handleResponse(response);
};

/**
 * Delete a user
 * @param {number} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteUser = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/${userId}`,
    {
      method: 'DELETE',
      headers: getAuthHeader(),
    }
  );
  return handleResponse(response);
};

// ==================== Language Operations ====================

export const getLanguages = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/languages`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const getCoursesByLanguage = async (language) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/languages/${language}/courses`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

// ==================== Course Operations ====================

export const createCourse = async (courseData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: JSON.stringify(courseData),
  });
  return handleResponse(response);
};

export const getCourseDetails = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const updateCourse = async (courseId, courseData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeader(),
    },
    body: JSON.stringify(courseData),
  });
  return handleResponse(response);
};

export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

// ==================== Unit Operations ====================

export const createUnit = async (courseId, unitData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}/units`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: JSON.stringify(unitData),
  });
  return handleResponse(response);
};

export const updateUnit = async (unitId, unitData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeader(),
    },
    body: JSON.stringify(unitData),
  });
  return handleResponse(response);
};

export const deleteUnit = async (unitId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

// ==================== Lesson Operations ====================

export const createLesson = async (unitId, lessonData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}/lessons`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: JSON.stringify(lessonData),
  });
  return handleResponse(response);
};

export const updateLesson = async (lessonId, lessonData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeader(),
    },
    body: JSON.stringify(lessonData),
  });
  return handleResponse(response);
};

export const deleteLesson = async (lessonId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

// ==================== Analytics Operations ====================

export const getAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const getAnalyticsForPeriod = async (days = 30) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/period?days=${days}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const getLanguageDistribution = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/languages`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const getModuleUsage = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/modules`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const getUserEngagement = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/engagement`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const getLessonCompletionTrends = async (days = 30) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/trends?days=${days}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

// ==================== User Management (Admin) ====================

export const getLearners = async ({ search = '', page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const response = await fetch(`${API_BASE_URL}/api/admin/users?${params.toString()}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const getLearnerDetails = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const updateLearner = async (userId, { name, email }) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeader(),
    },
    body: JSON.stringify({ name, email }),
  });
  return handleResponse(response);
};

// ==================== Email Campaign Operations ====================

/**
 * Get all learners for email campaign
 * @returns {Promise<{success: boolean, data: {learners: Array, count: number}}>}
 */
export const getLearnersForCampaign = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/email-campaign/learners`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

/**
 * Trigger N8N email campaign workflow
 * @returns {Promise<{success: boolean, data: Object, message: string}>}
 */
export const triggerEmailCampaign = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/email-campaign/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

/**
 * Export learners as CSV
 * @returns {Promise<Blob>}
 */
export const exportLearnersCSV = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/email-campaign/export-csv`, {
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to export CSV');
  }
  
  return response.blob();
};
