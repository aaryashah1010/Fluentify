import { API_BASE_URL, handleResponse, getAuthHeader } from './apiHelpers';

/**
 * Create a Retell AI call and get access token
 * @param {string} agentId - Retell agent ID
 * @param {number} [courseId] - Which of the learner's courses to practice, if they have more than one
 * @returns {Promise<{success: boolean, data: {accessToken: string, callId: string}}>}
 */
export const createRetellCall = async (agentId, courseId) => {
  const response = await fetch(`${API_BASE_URL}/api/retell/create-call`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(courseId ? { agentId, courseId } : { agentId }),
  });

  return handleResponse(response);
};
