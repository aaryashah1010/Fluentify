import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Fetch progress report for a course
 * @param {number} courseId - Course ID
 * @param {string} timeRange - Time range (7days, 30days, 90days, all)
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchProgressReport = async (courseId, timeRange = '30days') => {
  const response = await fetch(
    `${API_BASE_URL}/api/progress/courses/${courseId}/report?timeRange=${timeRange}`,
    {
      headers: getAuthHeader(),
    }
  );
  
  return handleResponse(response);
};
