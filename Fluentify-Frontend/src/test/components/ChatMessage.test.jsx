/**
 * @jest-environment jsdom
 */

import React from 'react';
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import ChatMessageRaw from '../../components/ChatMessage.jsx';

// Normalize default export (function vs { default })
const ChatMessage = typeof ChatMessageRaw === 'function' ? ChatMessageRaw : ChatMessageRaw.default;

// Tests mirror backend Jest style (describe/it, minimal mocks),
// using React Testing Library only to inspect rendered output.

describe('ChatMessage component', () => {
  const baseMessage = {
    sender: 'user',
    text: 'Hello',
    timestamp: '2025-01-01T10:15:00.000Z'
  };

  it('renders user message with correct alignment, avatar and bubble styles', () => {
    const { container } = render(<ChatMessage message={baseMessage} isStreaming={false} />);

    // Avatar should show "U" for user
    const avatar = screen.getByText('U');
    expect(avatar).not.toBeNull();

    // Outer flex container should justify content to the end for user
    const outer = container.querySelector('div.flex.justify-end');
    expect(outer).not.toBeNull();
  });

  it('renders AI message with correct avatar and bubble styles', () => {
    const aiMessage = { ...baseMessage, sender: 'ai', text: 'Hi there' };

    render(<ChatMessage message={aiMessage} isStreaming={false} />);

    // Avatar should show the robot emoji
    const avatar = screen.getByText('🤖');
    expect(avatar).not.toBeNull();

    // Message text present
    expect(screen.getByText('Hi there')).not.toBeNull();
  });

  it('renders simple markdown: bold and inline code, with line breaks', () => {
    const mdText = '**Bold** normal `code`\nSecond line';
    const message = { ...baseMessage, text: mdText };

    render(<ChatMessage message={message} isStreaming={false} />);

    // Bold text should be wrapped in <strong>
    const bold = screen.getByText('Bold');
    expect(bold.tagName.toLowerCase()).toBe('strong');

    // Inline code should be wrapped in <code>
    const code = screen.getByText('code');
    expect(code.tagName.toLowerCase()).toBe('code');

    // Second line content should appear (allowing for potential splitting)
    expect(screen.getByText((content) => content.includes('Second line'))).not.toBeNull();
  });

  it('shows streaming indicator when isStreaming is true', () => {
    const message = { ...baseMessage, text: 'Thinking…', timestamp: null };

    const { container } = render(<ChatMessage message={message} isStreaming={true} />);

    // Streaming indicator is a span with animate-pulse class
    const indicator = container.querySelector('span.animate-pulse');
    expect(indicator).not.toBeNull();
  });

  it('shows formatted timestamp when provided and not streaming', () => {
    const message = { ...baseMessage, sender: 'ai' };

    const { container } = render(<ChatMessage message={message} isStreaming={false} />);

    // Timestamp should be displayed in a text-xs container (actual text depends on locale)
    const timeContainer = container.querySelector('div.text-xs.mt-2.opacity-70');
    expect(timeContainer).not.toBeNull();
    expect(timeContainer.textContent.trim().length).toBeGreaterThan(0);
  });

  it('hides timestamp while streaming even if timestamp present', () => {
    const message = { ...baseMessage };

    render(<ChatMessage message={message} isStreaming={true} />);

    // No element should contain the formatted time while streaming
    const maybeTime = screen.queryByText((content) => /10:15/.test(content));
    expect(maybeTime).toBeNull();
  });

  it('handles message with null or empty text', () => {
    const messageWithNull = { ...baseMessage, text: null };
    const { rerender } = render(<ChatMessage message={messageWithNull} />);

    // Should render without errors
    expect(screen.getByText('U')).not.toBeNull();

    // Test with empty string
    const messageWithEmpty = { ...baseMessage, text: '' };
    rerender(<ChatMessage message={messageWithEmpty} />);
    expect(screen.getByText('U')).not.toBeNull();
  });

  it('handles message with null or missing timestamp', () => {
    const messageNoTimestamp = { sender: 'ai', text: 'Hello', timestamp: null };
    const { container } = render(<ChatMessage message={messageNoTimestamp} isStreaming={false} />);

    // No timestamp container should be rendered
    const timeContainer = container.querySelector('div.text-xs.mt-2.opacity-70');
    expect(timeContainer).toBeNull();
  });

  it('handles message without timestamp property', () => {
    const messageNoTimestamp = { sender: 'user', text: 'Test' };
    const { container } = render(<ChatMessage message={messageNoTimestamp} isStreaming={false} />);

    // Should render without errors
    expect(screen.getByText('Test')).not.toBeNull();

    // No timestamp container should be present
    const timeContainer = container.querySelector('div.text-xs.mt-2.opacity-70');
    expect(timeContainer).toBeNull();
  });
});
