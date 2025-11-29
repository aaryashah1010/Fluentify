/**
 * @jest-environment jsdom
 */

import React from 'react';
import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';

import FloatingChatWidgetRaw from '../../components/FloatingChatWidget.jsx';

// Minimal mocks for lucide-react icons and TutorChat so the widget can render
jest.mock('lucide-react', () => ({
  MessageCircle: (props) => <span data-testid="message-circle-icon" {...props} />,
  X: (props) => <span data-testid="x-icon" {...props} />,
  Minimize2: (props) => <span data-testid="minimize-icon" {...props} />,
}));

jest.mock('../../modules/learner/TutorChat', () => (props) => (
  <div data-testid="tutor-chat" data-compact={props.compact} />
));

// Normalize default export (function vs { default })
const FloatingChatWidget =
  typeof FloatingChatWidgetRaw === 'function'
    ? FloatingChatWidgetRaw
    : FloatingChatWidgetRaw.default;

// Tests mirror backend Jest style (describe/it, minimal mocks),
// using React Testing Library only to inspect rendered output.

describe('FloatingChatWidget component', () => {
  it('renders floating button on the right by default and no chat panel initially', () => {
    const { container } = render(<FloatingChatWidget />);

    // Chat panel should not be present when closed
    expect(container.querySelector('div.w-96')).toBeNull();

    // Floating button should be present with MessageCircle icon
    const button = screen.getByRole('button');
    expect(button).not.toBeNull();
    expect(button.className).toContain('bottom-4');
    expect(button.className).toContain('right-4');
    expect(screen.getByTestId('message-circle-icon')).not.toBeNull();
  });

  it('places floating button on the left when position="left"', () => {
    const { container } = render(<FloatingChatWidget position="left" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bottom-4');
    expect(button.className).toContain('left-4');
    // No chat panel initially
    expect(container.querySelector('div.w-96')).toBeNull();
  });

  it('opens chat panel with TutorChat when floating button is clicked', () => {
    const { container } = render(<FloatingChatWidget />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Chat panel should appear
    const panel = container.querySelector('div.w-96');
    expect(panel).not.toBeNull();

    // TutorChat should be rendered in compact mode
    const tutorChat = screen.getByTestId('tutor-chat');
    expect(tutorChat).not.toBeNull();
    expect(tutorChat.getAttribute('data-compact')).toBe('true');
  });

  it('minimizes chat panel and shows floating button again when minimize is clicked', () => {
    const { container } = render(<FloatingChatWidget />);

    // Open the chat
    fireEvent.click(screen.getByRole('button'));

    // Click minimize button in header
    const minimizeButton = screen.getByTitle('Minimize');
    fireEvent.click(minimizeButton);

    // Panel should now have minimized height class
    const panel = container.querySelector('div.w-96');
    expect(panel.className).toContain('h-14');

    // Chat content (TutorChat) should be hidden when minimized
    expect(screen.queryByTestId('tutor-chat')).toBeNull();

    // Floating button should be visible again (for maximizing)
    const floatButton = screen.getByRole('button', { name: /Maximize Chat|Chat with AI Tutor/i });
    expect(floatButton).not.toBeNull();
  });

  it('maximizes chat when header is clicked while minimized', () => {
    const { container } = render(<FloatingChatWidget />);

    // Open and then minimize chat
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByTitle('Minimize'));

    // Click header area to maximize
    const headerClickable = container.querySelector('div.flex.items-center.gap-2');
    fireEvent.click(headerClickable);

    // Panel should no longer be minimized height
    const panel = container.querySelector('div.w-96');
    expect(panel.className).not.toContain('h-14');

    // TutorChat content should be visible again
    expect(screen.getByTestId('tutor-chat')).not.toBeNull();
  });

  it('closes chat panel when close button is clicked and restores floating button', () => {
    const { container } = render(<FloatingChatWidget />);

    // Open chat
    fireEvent.click(screen.getByRole('button'));

    // Click close button in header
    const closeButton = screen.getByTitle('Close');
    fireEvent.click(closeButton);

    // Panel should be removed
    expect(container.querySelector('div.w-96')).toBeNull();

    // Floating button should be visible again on the right
    const floatButton = screen.getByRole('button');
    expect(floatButton).not.toBeNull();
    expect(floatButton.className).toContain('right-4');
  });

  it('maximizes chat via floating button when minimized', () => {
    const { container } = render(<FloatingChatWidget />);

    // Open chat
    fireEvent.click(screen.getByRole('button'));
    // Minimize via header button
    fireEvent.click(screen.getByTitle('Minimize'));

    // Floating button should now be visible with title "Maximize Chat"
    const floatButton = screen.getByRole('button', { name: /Maximize Chat/i });
    expect(floatButton).not.toBeNull();

    // Click floating button to trigger toggleChat for isOpen && isMinimized branch
    fireEvent.click(floatButton);

    // Panel should be expanded again (not minimized height) and TutorChat visible
    const panel = container.querySelector('div.w-96');
    expect(panel.className).not.toContain('h-14');
    expect(screen.getByTestId('tutor-chat')).not.toBeNull();
  });

  it('hides floating button when chat is open and restores it after closing', () => {
    const { container } = render(<FloatingChatWidget />);

    // Floating button is visible initially
    const floatButton = screen.getByRole('button');
    expect(floatButton).not.toBeNull();

    // Open chat using floating button
    fireEvent.click(floatButton);

    // Chat panel should be visible and floating button should no longer be rendered
    expect(container.querySelector('div.w-96')).not.toBeNull();
    expect(screen.queryByRole('button', { name: /Chat with AI Tutor/i })).toBeNull();

    // Close chat from header
    const closeButton = screen.getByTitle('Close');
    fireEvent.click(closeButton);

    // Panel should be closed and floating button visible again
    expect(container.querySelector('div.w-96')).toBeNull();
    expect(screen.getByRole('button')).not.toBeNull();
  });
});
