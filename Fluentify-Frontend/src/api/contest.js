import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Contest API Client
 * API functions for contest management and participation
 */

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Create a new contest (Admin only)
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.description
 * @param {string} data.start_time - ISO timestamp
 * @param {string} data.end_time - ISO timestamp
 * @returns {Promise<{success: boolean, data: object}>}
 */
export const apiAdminCreateContest = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/admin`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
};

/**
 * Update contest details (Admin only)
 * @param {number} contestId
 * @param {Object} data
 * @returns {Promise<{success: boolean, data: object}>}
 */
export const apiAdminUpdateContest = async (contestId, data) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/admin/${contestId}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
};

/**
 * Add a question to a contest (Admin only)
 * @param {number} contestId
 * @param {Object} data
 * @param {string} data.question_text
 * @param {Array} data.options - [{id: 0, text: "Option A"}, ...]
 * @param {number} data.correct_option_id
 * @returns {Promise<{success: boolean, data: object}>}
 */
export const apiAdminAddQuestion = async (contestId, data) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/admin/${contestId}/questions`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
};

/**
 * Publish a contest (Admin only)
 * @param {number} contestId
 * @returns {Promise<{success: boolean, data: object}>}
 */
export const apiAdminPublishContest = async (contestId) => {
  const baseHeaders = { 
    ...getAuthHeader(), 
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  /* istanbul ignore next */
  const tryRequest = async (url, method, body = {}) => {
    try {
      const res = await fetch(url, {
        method,
        headers: baseHeaders,
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      });
      if (res.ok) return handleResponse(res);
      // Only allow fallback on obvious route/method issues
      if (res.status === 404 || res.status === 405) return null;
      // Surface other server errors
      return handleResponse(res);
    } catch {
      // Network error -> allow trying next variant
      return null;
    }
  };

  // If an explicit path is provided via env, try it first.
  // Supports placeholders: :id or {id}
  /* istanbul ignore next */
  const customPath =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_CONTEST_PUBLISH_PATH;
  /* istanbul ignore next */
  if (customPath) {
    const replaced = customPath.replace(/:id|\{id\}/g, String(contestId));
    const url = replaced.startsWith('http') ? replaced : `${API_BASE_URL}${replaced.startsWith('/') ? '' : '/'}${replaced}`;
    for (const m of ['PATCH', 'POST', 'PUT']) {
      const result = await tryRequest(url, m, {});
      if (result) return result;
    }
  }

  const candidates = [
    // Primary: dedicated publish endpoint (matches backend: PATCH /api/contests/admin/:contestId/publish)
    { url: `${API_BASE_URL}/api/contests/admin/${contestId}/publish`, methods: ['PATCH'] },
    // Fallback: try POST/PUT on same endpoint
    { url: `${API_BASE_URL}/api/contests/admin/${contestId}/publish`, methods: ['POST', 'PUT'] },
  ];

  // Try direct publish endpoints
  for (const c of candidates) {
    const body = c.body || {};
    for (const m of c.methods) {
      const result = await tryRequest(c.url, m, body);
      if (result) return result;
    }
  }

  throw { status: 404, message: 'Publish route not found on server. Please ensure the backend exposes a publish endpoint.' };
};

/**
 * Get all contests (Admin view)
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const apiAdminGetContests = async () => {
  const response = await fetch(`${API_BASE_URL}/api/contests/admin`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get contest details with questions (Admin view)
 * @param {number} contestId
 * @returns {Promise<{success: boolean, data: object}>}
 */
export const apiAdminGetContestDetails = async (contestId) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/admin/${contestId}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Delete a contest (Admin only)
 * @param {number} contestId
 * @returns {Promise<{success: boolean}>}
 */
export const apiAdminDeleteContest = async (contestId) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/admin/${contestId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

// ============================================
// LEARNER ENDPOINTS
// ============================================

/**
 * Get available contests for learners
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const apiGetAvailableContests = async () => {
  const response = await fetch(`${API_BASE_URL}/api/contests`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get contest details for participation
 * @param {number} contestId
 * @returns {Promise<{success: boolean, data: {contest: object, questions: Array}}>}
 */
export const apiGetContestDetails = async (contestId) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/${contestId}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Submit contest answers
 * @param {number} contestId
 * @param {Object} data
 * @param {number} data.start_time - Timestamp when user started
 * @param {Array} data.submissions - [{question_id, selected_option_id}, ...]
 * @returns {Promise<{success: boolean, data: {score, total_questions, time_taken_ms, rank, total_participants}}>}
 */
export const apiSubmitContest = async (contestId, data) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/${contestId}/submit`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
};

/**
 * Get leaderboard for a contest
 * @param {number} contestId
 * @returns {Promise<{success: boolean, data: {contest: object, leaderboard: Array}}>}
 */
export const apiGetLeaderboard = async (contestId) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/${contestId}/leaderboard`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get user's contest history
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const apiGetUserContestHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/api/contests/my-contests`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};

/**
 * Get user's result details for a specific contest
 * @param {number} contestId
 * @returns {Promise<{success: boolean, data: {contest, result, submissions}}>}
 */
export const apiGetUserContestResult = async (contestId) => {
  const response = await fetch(`${API_BASE_URL}/api/contests/${contestId}/my-result`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  return handleResponse(response);
};
