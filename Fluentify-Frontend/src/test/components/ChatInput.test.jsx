/**
 * @jest-environment jsdom
 */

import React from 'react';
import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';

import ChatInputRaw from '../../components/ChatInput.jsx';

// Normalize default export (function vs { default })
const ChatInput = typeof ChatInputRaw === 'function' ? ChatInputRaw : ChatInputRaw.default;

// These tests mirror the backend style (Jest + ESM, minimal mocks),
// but use @testing-library/react so React hooks execute correctly.

describe('ChatInput component', () => {
  it('renders textarea and send button with default props', () => {
    const onSendMessage = jest.fn();

    render(<ChatInput onSendMessage={onSendMessage} />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');
    expect(textarea).not.toBeNull();
    expect(textarea.getAttribute('rows')).toBe('1');
    expect(textarea.disabled).toBe(false);

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).not.toBeNull();
    // Initially disabled because message is empty
    expect(sendButton.disabled).toBe(true);
  });

  it('disables textarea and button when disabled prop is true', () => {
    const onSendMessage = jest.fn();

    render(<ChatInput onSendMessage={onSendMessage} disabled />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');
    const sendButton = screen.getByRole('button', { name: /send/i });

    expect(textarea.disabled).toBe(true);
    expect(sendButton.disabled).toBe(true);
  });

  it('does not call onSendMessage when submitting with empty message', () => {
    const onSendMessage = jest.fn();

    render(<ChatInput onSendMessage={onSendMessage} />);

    const sendButton = screen.getByRole('button', { name: /send/i });

    // Even if user clicks, empty trimmed message should not be sent
    fireEvent.click(sendButton);

    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('enables send button and submits message, then clears input', () => {
    const onSendMessage = jest.fn();

    render(<ChatInput onSendMessage={onSendMessage} />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Type a non-empty message
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    // Button should now be enabled
    expect(sendButton.disabled).toBe(false);

    // Click send
    fireEvent.click(sendButton);

    expect(onSendMessage).toHaveBeenCalledTimes(1);
    expect(onSendMessage).toHaveBeenCalledWith('Hello world');

    // Message should be cleared, disabling the button again
    expect(textarea.value).toBe('');
    expect(sendButton.disabled).toBe(true);
  });

  it('submits on Enter key but not on Shift+Enter', () => {
    const onSendMessage = jest.fn();

    render(<ChatInput onSendMessage={onSendMessage} />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');

    // First, type message and press Shift+Enter: should NOT submit
    fireEvent.change(textarea, { target: { value: 'Line 1' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
    expect(onSendMessage).not.toHaveBeenCalled();

    // Press Enter without shift: should submit
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: false });
    expect(onSendMessage).toHaveBeenCalledTimes(1);
    expect(onSendMessage).toHaveBeenCalledWith('Line 1');
  });

  it('enforces 2000 character limit in handleChange', () => {
    const onSendMessage = jest.fn();

    render(<ChatInput onSendMessage={onSendMessage} />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');

    const twoThousand = 'x'.repeat(2000);
    const tooLong = 'y'.repeat(2001);

    // Accept up to 2000 characters
    fireEvent.change(textarea, { target: { value: twoThousand } });
    expect(textarea.value.length).toBe(2000);

    // Attempt to exceed limit should not increase stored value
    fireEvent.change(textarea, { target: { value: tooLong } });
    expect(textarea.value.length).toBe(2000);
  });

  it('handles auto-resize effect when textarea ref is null', () => {
    const onSendMessage = jest.fn();

    // Force useRef to return a null current once so the effect guard's false branch runs
    const spy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });

    render(<ChatInput onSendMessage={onSendMessage} />);

    // No crash; effect ran with current === null. Restore original implementation.
    spy.mockRestore();
  });

  it('shows character count when message length > 1500', () => {
    const onSendMessage = jest.fn();
    const { container } = render(<ChatInput onSendMessage={onSendMessage} />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');

    // Type 1600 characters
    const longMessage = 'x'.repeat(1600);
    fireEvent.change(textarea, { target: { value: longMessage } });

    // Character count should be displayed
    const charCount = container.querySelector('.text-xs');
    expect(charCount).not.toBeNull();
    expect(charCount.textContent).toContain('1600/2000');
  });

  it('shows red warning when message length > 1900', () => {
    const onSendMessage = jest.fn();
    const { container } = render(<ChatInput onSendMessage={onSendMessage} />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');

    // Type 1950 characters
    const veryLongMessage = 'x'.repeat(1950);
    fireEvent.change(textarea, { target: { value: veryLongMessage } });

    // Character count should be displayed with red warning
    const charCount = container.querySelector('.text-xs');
    expect(charCount).not.toBeNull();
    expect(charCount.textContent).toContain('1950/2000');
    expect(charCount.className).toContain('text-red-400');
  });

  it('should auto-resize textarea on input', () => {
    const onSendMessage = jest.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);

    const textarea = screen.getByPlaceholderText('Ask me anything about your target language!');

    // Mock scrollHeight
    Object.defineProperty(textarea, 'scrollHeight', { value: 100, configurable: true });

    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(textarea.style.height).toBe('100px');
  });
});
