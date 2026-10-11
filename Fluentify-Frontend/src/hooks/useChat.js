import { useReducer, useEffect, useCallback } from 'react';
import { sendMessageStream, openCourseChatSession } from '../api/tutor';

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

export const useChat = (token, courseId = null) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Course-scoped chat: load the real conversation from the server (it's
  // persisted there, not just in this browser tab), so the learner sees
  // their past messages for that course every time they open it.
  useEffect(() => {
    if (!courseId || !token) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await openCourseChatSession(courseId, token);
        if (cancelled) return;
        const { session, messages } = response.data;
        dispatch({
          type: 'LOAD_MESSAGES',
          payload: messages.map((m) => ({
            id: m.id,
            sender: m.sender_type === 'user' ? 'user' : 'ai',
            text: m.content,
            timestamp: new Date(m.created_at),
          })),
        });
        dispatch({ type: 'SET_SESSION_ID', payload: session.id });
      } catch (error) {
        console.error('Error opening course chat session:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Could not load this course\'s chat history.' });
      }
    })();

    return () => { cancelled = true; };
  }, [courseId, token]);

  // General chat (no specific course): keep the existing per-tab persistence
  useEffect(() => {
    if (courseId) return;
    const savedMessages = sessionStorage.getItem('fluentify_chat_messages');
    const savedSessionId = sessionStorage.getItem('fluentify_chat_session_id');

    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages);
        dispatch({ type: 'LOAD_MESSAGES', payload: messages });
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }

    if (savedSessionId) {
      dispatch({ type: 'SET_SESSION_ID', payload: savedSessionId });
    }
  }, [courseId]);

  // Save messages to sessionStorage whenever messages change (general chat only)
  useEffect(() => {
    if (courseId) return;
    if (state.messages.length > 0) {
      sessionStorage.setItem('fluentify_chat_messages', JSON.stringify(state.messages));
    }
  }, [state.messages, courseId]);

  // Save session ID to sessionStorage (general chat only)
  useEffect(() => {
    if (courseId) return;
    if (state.sessionId) {
      sessionStorage.setItem('fluentify_chat_session_id', state.sessionId);
    }
  }, [state.sessionId, courseId]);

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
        },
        courseId
      );

      // Update session ID if new session was created
      if (result.sessionId && result.sessionId !== state.sessionId) {
        dispatch({ type: 'SET_SESSION_ID', payload: result.sessionId });
      }

    } catch (error) {
      console.error('Send message error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to send message' });
    }
  }, [token, state.sessionId, courseId]);

  const clearChat = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT' });
    sessionStorage.removeItem('fluentify_chat_messages');
    sessionStorage.removeItem('fluentify_chat_session_id');
  }, []);

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
