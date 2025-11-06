import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Admin API Client
 * API functions for admin content management
 */

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
    headers: getAuthHeader(),
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
    headers: getAuthHeader(),
    body: JSON.stringify(courseData),
  });
  return handleResponse(response);
};

export const deleteCourse = async (courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

// ==================== Unit Operations ====================

export const createUnit = async (courseId, unitData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}/units`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(unitData),
  });
  return handleResponse(response);
};

export const updateUnit = async (unitId, unitData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(unitData),
  });
  return handleResponse(response);
};

export const deleteUnit = async (unitId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

// ==================== Lesson Operations ====================

export const createLesson = async (unitId, lessonData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/units/${unitId}/lessons`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(lessonData),
  });
  return handleResponse(response);
};

export const updateLesson = async (lessonId, lessonData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(lessonData),
  });
  return handleResponse(response);
};

export const deleteLesson = async (lessonId) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
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
    headers: getAuthHeader(),
    body: JSON.stringify({ name, email }),
  });
  return handleResponse(response);
};
