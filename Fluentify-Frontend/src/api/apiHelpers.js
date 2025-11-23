/**
 * Shared API Helper Functions
 * Common utilities for API calls across all API modules
 */

// Base API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * FIX: Handle API response with improved error handling
 * Only triggers logout on actual authentication failures (401/403)
 * Prevents unnecessary logout on other API errors
 * @param {Response} response - Fetch API response
 * @returns {Promise<any>} - Parsed JSON data
 */
export const handleResponse = async (response) => {
  let data;
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
    data = {};
  } else {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    // FIX: Only logout on actual authentication/authorization failures
    // Don't logout on other errors like 400, 404, 500, etc.
    if (response.status === 401) {
      // Token expired or invalid - clear token and logout
      console.warn('Authentication failed: Token expired or invalid');
      localStorage.removeItem('jwt');
      // Don't throw here - let the error propagate so components can handle it
      // The ProtectedRoute will handle the redirect
    } else if (response.status === 403) {
      // Forbidden - user doesn't have permission
      // This might be a role issue, but don't logout immediately
      // Let the component handle the error message
      console.warn('Access forbidden: Insufficient permissions');
    }
    
    throw {
      status: response.status,
      message: data.error?.message || data.message || 'Request failed',
      data
    };
  }
  return data;
};

/**
 * Get authorization header with JWT token
 * @returns {Object} - Headers object with Authorization
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('jwt');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Get URL with JWT token as query parameter (for SSE/EventSource)
 * @param {string} baseUrl - Base URL without token
 * @returns {string} - URL with token as query parameter
 */
export const getAuthUrl = (baseUrl) => {
  const token = localStorage.getItem('jwt');
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}token=${token}`;
};
