/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import TypingIndicatorRaw from '../../components/TypingIndicator.jsx';

// Normalize default export (function vs { default }) to mirror other chat tests
const TypingIndicator =
  typeof TypingIndicatorRaw === 'function' ? TypingIndicatorRaw : TypingIndicatorRaw.default;

// Tests mirror backend-style: describe/it, minimal mocks, and
// React Testing Library only for DOM assertions.

describe('TypingIndicator component', () => {
  it('renders AI avatar with robot emoji and left alignment', () => {
    const { container } = render(<TypingIndicator />);

    // Avatar should show the robot emoji
    const avatar = screen.getByText('🤖');
    expect(avatar).not.toBeNull();

    // Outer container should be left-aligned
    const outer = container.querySelector('div.flex.justify-start');
    expect(outer).not.toBeNull();
  });

  it('renders three animated typing dots with staggered delays', () => {
    const { container } = render(<TypingIndicator />);

    // Dots are small circles with animate-bounce
    const dots = container.querySelectorAll('div.w-2.h-2.bg-gray-400.rounded-full.animate-bounce');
    expect(dots.length).toBe(3);

    // Verify the staggered animation delays
    const delays = Array.from(dots).map((dot) => dot.style.animationDelay);
    expect(delays).toEqual(['0ms', '150ms', '300ms']);
  });

  it('shows the typing status text', () => {
    render(<TypingIndicator />);

    const text = screen.getByText('Fluent is typing...');
    expect(text).not.toBeNull();
    expect(text.className).toContain('text-xs');
  });
});
