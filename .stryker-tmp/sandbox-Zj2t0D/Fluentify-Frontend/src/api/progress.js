// @ts-nocheck
import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Progress API Client
 * API functions for learner progress tracking and reporting
 */

/**
 * Fetch progress report with summary, timeline, and recent activity
 * @param {string} timeRange - Time range filter ('7d', '30d', 'all')
 * @param {string|null} courseId - Optional course ID to filter by specific course
 * @returns {Promise<{success: boolean, data: {summary: Object, timeline: Array, recentActivity: Array}}>}
 */
export const fetchProgressReport = async (timeRange = 'all', courseId = null) => {
  const params = new URLSearchParams({ range: timeRange });
  if (courseId) {
    params.append('courseId', courseId);
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/progress/report?${params.toString()}`,
    { headers: getAuthHeader() }
  );
  return handleResponse(response);
};
