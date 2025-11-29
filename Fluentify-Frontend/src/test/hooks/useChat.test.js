/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';

// Mocks
const mockSendMessageStream = jest.fn();

jest.unstable_mockModule('../../api/tutor', () => ({
  sendMessageStream: mockSendMessageStream,
}));

describe('useChat hook', () => {
  let useChat;
  let chatReducer;
  let initialState;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock sessionStorage
    const sessionStorageMock = (function () {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn(key => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();
    Object.defineProperty(global, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true
    });

    const module = await import('../../hooks/useChat');
    useChat = module.useChat;
    chatReducer = module.__testables__.chatReducer;
    initialState = module.__testables__.initialState;
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useChat('test-token'));

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isTyping).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load saved messages from sessionStorage', () => {
    const savedMessages = [{ id: '1', text: 'Hello', sender: 'user' }];
    sessionStorage.setItem('fluentify_chat_messages', JSON.stringify(savedMessages));
    sessionStorage.setItem('fluentify_chat_session_id', 'session-123');

    const { result } = renderHook(() => useChat('test-token'));

    expect(result.current.messages).toEqual(savedMessages);
    expect(result.current.sessionId).toBe('session-123');
  });

  it('should handle send message error if no token', async () => {
    const { result } = renderHook(() => useChat(null));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBe('Authentication required');
  });

  it('should handle send message error if empty message', async () => {
    const { result } = renderHook(() => useChat('test-token'));

    await act(async () => {
      await result.current.sendMessage('');
    });

    expect(result.current.error).toBe('Message cannot be empty');
  });

  it('should send message and handle streaming success', async () => {
    mockSendMessageStream.mockImplementation(async (msg, sessionId, token, onChunk, onComplete) => {
      onChunk('Hello');
      onChunk(' World');
      onComplete();
      return { sessionId: 'new-session-id' };
    });

    const { result } = renderHook(() => useChat('test-token'));

    await act(async () => {
      await result.current.sendMessage('Hi AI');
    });

    // Check user message added
    expect(result.current.messages[0].text).toBe('Hi AI');
    expect(result.current.messages[0].sender).toBe('user');

    // Check AI message added and updated
    expect(result.current.messages[1].sender).toBe('ai');
    expect(result.current.messages[1].text).toBe('Hello World');
    expect(result.current.messages[1].isStreaming).toBe(false);

    expect(result.current.sessionId).toBe('new-session-id');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('fluentify_chat_session_id', 'new-session-id');
  });

  it('should handle streaming error', async () => {
    mockSendMessageStream.mockImplementation(async (msg, sessionId, token, onChunk, onComplete, onError) => {
      onError('Stream failed');
      return {};
    });

    const { result } = renderHook(() => useChat('test-token'));

    await act(async () => {
      await result.current.sendMessage('Hi AI');
    });

    expect(result.current.error).toBe('Stream failed');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API error', async () => {
    mockSendMessageStream.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useChat('test-token'));

    await act(async () => {
      await result.current.sendMessage('Hi AI');
    });

    expect(result.current.error).toBe('API Error');
  });

  it('should handle API error with fallback message', async () => {
    mockSendMessageStream.mockRejectedValue({}); // No message property

    const { result } = renderHook(() => useChat('test-token'));

    await act(async () => {
      await result.current.sendMessage('Hi AI');
    });

    expect(result.current.error).toBe('Failed to send message');
  });

  it('should clear chat', () => {
    const { result } = renderHook(() => useChat('test-token'));

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toEqual([]);
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('fluentify_chat_messages');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('fluentify_chat_session_id');
  });

  it('should clear error', async () => {
    const { result } = renderHook(() => useChat(null));

    await act(async () => {
      await result.current.sendMessage('Hello');
    });
    expect(result.current.error).toBe('Authentication required');

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('should handle error loading saved messages', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    sessionStorage.setItem('fluentify_chat_messages', 'invalid-json');

    renderHook(() => useChat('test-token'));

    expect(consoleSpy).toHaveBeenCalledWith('Error loading saved messages:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // Reducer tests for coverage
  it('should handle SET_TYPING action in reducer', () => {
    const newState = chatReducer(initialState, { type: 'SET_TYPING', payload: true });
    expect(newState.isTyping).toBe(true);
  });

  it('should handle unknown action in reducer', () => {
    const newState = chatReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(initialState);
  });
});
