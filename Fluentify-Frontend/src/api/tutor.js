import { API_BASE_URL, handleResponse } from './apiHelpers';

/**
 * AI Tutor Chat API Client
 * Handles streaming chat communication with AI tutor
 */

/**
 * Send a message to AI tutor with streaming response
 * @param {string} message - User message
 * @param {string} sessionId - Optional session ID
 * @param {string} token - JWT token
 * @param {function} onChunk - Callback for each response chunk
 * @param {function} onComplete - Callback when streaming is complete
 * @param {function} onError - Callback for errors
 * @returns {Promise<{sessionId: string}>}
 */
export const sendMessageStream = async (message, sessionId, token, onChunk, onComplete, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tutor/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, sessionId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send message');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let extractedSessionId = sessionId;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Check for session ID in the first chunk
        if (!extractedSessionId && buffer.includes('SESSION_ID:')) {
          const sessionMatch = buffer.match(/SESSION_ID:([^\n]+)/);
          if (sessionMatch) {
            extractedSessionId = sessionMatch[1];
            buffer = buffer.replace(/SESSION_ID:[^\n]+\n/, '');
          }
        }

        // Send chunks to callback
        if (buffer && onChunk) {
          onChunk(buffer);
          buffer = ''; // Clear buffer after processing
        }
      }

      // Send any remaining buffer content
      /* istanbul ignore next */
      if (buffer && onChunk) {
        onChunk(buffer);
      }

      if (onComplete) {
        onComplete();
      }

      return { sessionId: extractedSessionId };

    } catch (streamError) {
      console.error('Stream reading error:', streamError);
      if (onError) {
        onError('Connection interrupted. Please try again.');
      }
      throw streamError;
    }

  } catch (error) {
    console.error('Send message error:', error);
    
    // Handle different error types
    /* istanbul ignore next */
    if (error.message.includes('rate_limit') || error.message.includes('too quickly')) {
      if (onError) onError('You\'re chatting too quickly. Please wait a few seconds.');
    } else if (error.message.includes('ai_failure') || error.message.includes('unavailable')) {
      if (onError) onError('Our AI tutor is temporarily unavailable.');
    } else if (error.message.includes('validation_error')) {
      if (onError) onError(error.message);
    } else {
      if (onError) onError('Check your connection and try again.');
    }
    
    throw error;
  }
};

/**
 * Get user's chat history
 * @param {string} token - JWT token
 * @param {number} limit - Number of sessions to fetch
 * @returns {Promise<{success: boolean, data: {sessions: array}}>}
 */
export const getChatHistory = async (token, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/api/tutor/history?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return handleResponse(response);
};

/**
 * Create a new chat session
 * @param {string} token - JWT token
 * @returns {Promise<{success: boolean, data: {session: object}}>}
 */
export const createChatSession = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/tutor/session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return handleResponse(response);
};

/**
 * Check tutor service health
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const checkTutorHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/api/tutor/health`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return handleResponse(response);
};
