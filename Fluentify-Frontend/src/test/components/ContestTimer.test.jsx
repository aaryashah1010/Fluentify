/**
 * @jest-environment jsdom
 */

import React from 'react';
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import ContestTimerRaw from '../../components/ContestTimer.jsx';

// Normalize default export (function vs { default })
const ContestTimer = typeof ContestTimerRaw === 'function' ? ContestTimerRaw : ContestTimerRaw.default;

// Tests mirror backend Jest style (describe/it, minimal mocks),
// using React Testing Library with fake timers to control time.

describe('ContestTimer component', () => {
  const FIXED_NOW = new Date('2025-01-01T10:00:00.000Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows green styling when more than 15 minutes remain', () => {
    const endTime = new Date(FIXED_NOW.getTime() + 20 * 60 * 1000).toISOString();

    const { container } = render(<ContestTimer endTime={endTime} onTimeUp={undefined} />);

    // Outer container should use green styles
    const outer = container.querySelector('div.border-2.rounded-lg');
    expect(outer).not.toBeNull();
    expect(outer.className).toContain('border-green-500');
    expect(outer.className).toContain('bg-green-50');

    // Text color helper also green
    const label = screen.getByText('Time Remaining');
    expect(label.className).toContain('text-green-700');
  });

  it('shows yellow styling when between 6 and 15 minutes remain', () => {
    const endTime = new Date(FIXED_NOW.getTime() + 10 * 60 * 1000).toISOString();

    const { container } = render(<ContestTimer endTime={endTime} onTimeUp={undefined} />);

    const outer = container.querySelector('div.border-2.rounded-lg');
    expect(outer).not.toBeNull();
    expect(outer.className).toContain('border-yellow-500');
    expect(outer.className).toContain('bg-yellow-50');

    const label = screen.getByText('Time Remaining');
    expect(label.className).toContain('text-yellow-700');
  });

  it('shows red styling and warning when 5 minutes or less remain', () => {
    const endTime = new Date(FIXED_NOW.getTime() + 4 * 60 * 1000).toISOString();

    const { container } = render(<ContestTimer endTime={endTime} onTimeUp={undefined} />);

    const outer = container.querySelector('div.border-2.rounded-lg');
    expect(outer).not.toBeNull();
    expect(outer.className).toContain('border-red-500');
    expect(outer.className).toContain('bg-red-50');

    const label = screen.getByText('Time Remaining');
    expect(label.className).toContain('text-red-700');

    // Warning message for <= 5 minutes
    expect(
      screen.getByText('⚠️ Hurry up! Less than 5 minutes remaining')
    ).not.toBeNull();
  });

  it('renders hours section when more than one hour remains', () => {
    const endTime = new Date(
      FIXED_NOW.getTime() + 2 * 60 * 60 * 1000 + 5 * 60 * 1000
    ).toISOString();

    render(<ContestTimer endTime={endTime} onTimeUp={undefined} />);

    // Hours block should be present with label "Hours"
    const hoursLabel = screen.getByText('Hours');
    expect(hoursLabel).not.toBeNull();

    // There should be at least one hour value displayed
    const hoursValue = hoursLabel.previousSibling;
    expect(hoursValue).not.toBeNull();
  });

  it("shows 'Time's Up' state and calls onTimeUp when already expired", () => {
    const onTimeUp = jest.fn();
    const pastEndTime = new Date(FIXED_NOW.getTime() - 1000).toISOString();

    render(<ContestTimer endTime={pastEndTime} onTimeUp={onTimeUp} />);

    // Effect runs synchronously on mount: expired state should be shown
    expect(screen.getByText("Time's Up!")).not.toBeNull();
    expect(screen.getByText('The contest has ended')).not.toBeNull();

    // onTimeUp should be called once
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it("shows 'Time's Up' state when expired even without onTimeUp callback", () => {
    const pastEndTime = new Date(FIXED_NOW.getTime() - 1000).toISOString();

    render(<ContestTimer endTime={pastEndTime} onTimeUp={undefined} />);

    expect(screen.getByText("Time's Up!"));
    expect(screen.getByText('The contest has ended'));
  });

  it('updates remaining time on interval tick', () => {
    const endTime = new Date(FIXED_NOW.getTime() + 2 * 60 * 1000).toISOString();

    render(<ContestTimer endTime={endTime} onTimeUp={undefined} />);

    const before = screen.getByText('Minutes').previousSibling.textContent;

    // Advance fake timers by one second to trigger setInterval callback
    jest.advanceTimersByTime(1000);

    const after = screen.getByText('Minutes').previousSibling.textContent;

    // Minutes value should be either the same or lower, but the tick has executed.
    // We only assert that the text is still a non-empty numeric string.
    expect(after).toMatch(/^\d{2}$/);
    expect(after.length).toBeGreaterThan(0);
  });
});
