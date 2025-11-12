import { useReducer, useEffect, useCallback } from 'react';
import { sendMessageStream, getSessionMessages } from '../api/tutor';
import { jwtDecode } from 'jwt-decode';

// Chat state management
const initialState = {
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
  isTyping: false
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isTyping: false };
    
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sender: 'user',
          text: action.payload,
          timestamp: new Date()
        }]
      };
    
    case 'START_AI_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, {
          id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sender: 'ai',
          text: '',
          timestamp: new Date(),
          isStreaming: true
        }],
        isTyping: true
      };
    
    case 'UPDATE_AI_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.sender === 'ai' && msg.isStreaming
            ? { ...msg, text: msg.text + action.payload }
            : msg
        )
      };
    
    case 'COMPLETE_AI_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.sender === 'ai' && msg.isStreaming
            ? { ...msg, isStreaming: false }
            : msg
        ),
        isLoading: false,
        isTyping: false
      };
    
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    
    case 'LOAD_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'CLEAR_CHAT':
      return { ...initialState };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const useChat = (token) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Get user ID from token for user-specific storage
  const getUserId = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded.userId || decoded.sub;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const userId = getUserId();

  // Load messages from server on mount
  useEffect(() => {
    const loadMessages = async () => {
      if (!token || !userId) return;

      // Get session ID from user-specific storage
      const savedSessionId = sessionStorage.getItem(`fluentify_chat_session_${userId}`);
      
      if (savedSessionId) {
        try {
          // Load messages from server
          const response = await getSessionMessages(savedSessionId, token);
          if (response.success && response.data.messages) {
            // Transform server messages to chat format
            const transformedMessages = response.data.messages.map(msg => ({
              id: msg.id,
              sender: msg.sender_type === 'user' ? 'user' : 'ai',
              text: msg.content,
              timestamp: new Date(msg.created_at),
              isStreaming: false
            }));
            dispatch({ type: 'LOAD_MESSAGES', payload: transformedMessages });
          }
          dispatch({ type: 'SET_SESSION_ID', payload: savedSessionId });
        } catch (error) {
          console.error('Error loading messages from server:', error);
          // Clear invalid session
          sessionStorage.removeItem(`fluentify_chat_session_${userId}`);
        }
      }
    };

    loadMessages();
  }, [token, userId]);

  // Save session ID to user-specific sessionStorage
  useEffect(() => {
    if (state.sessionId && userId) {
      sessionStorage.setItem(`fluentify_chat_session_${userId}`, state.sessionId);
    }
  }, [state.sessionId, userId]);

  const sendMessage = useCallback(async (message) => {
    if (!token) {
      dispatch({ type: 'SET_ERROR', payload: 'Authentication required' });
      return;
    }

    if (!message.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Message cannot be empty' });
      return;
    }

    try {
      // Clear any previous errors
      dispatch({ type: 'CLEAR_ERROR' });
      
      // Add user message
      dispatch({ type: 'ADD_USER_MESSAGE', payload: message.trim() });
      
      // Set loading state
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Start AI message
      dispatch({ type: 'START_AI_MESSAGE' });

      // Send message with streaming
      const result = await sendMessageStream(
        message.trim(),
        state.sessionId,
        token,
        // onChunk callback
        (chunk) => {
          dispatch({ type: 'UPDATE_AI_MESSAGE', payload: chunk });
        },
        // onComplete callback
        () => {
          dispatch({ type: 'COMPLETE_AI_MESSAGE' });
        },
        // onError callback
        (error) => {
          dispatch({ type: 'SET_ERROR', payload: error });
        }
      );

      // Update session ID if new session was created
      if (result.sessionId && result.sessionId !== state.sessionId) {
        dispatch({ type: 'SET_SESSION_ID', payload: result.sessionId });
      }

    } catch (error) {
      console.error('Send message error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to send message' });
    }
  }, [token, state.sessionId]);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT' });
    if (userId) {
      sessionStorage.removeItem(`fluentify_chat_session_${userId}`);
    }
  }, [userId]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    isTyping: state.isTyping,
    error: state.error,
    sessionId: state.sessionId,
    sendMessage,
    clearChat,
    clearError
  };
};
