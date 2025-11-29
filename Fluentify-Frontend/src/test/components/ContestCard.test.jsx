/**
 * @jest-environment jsdom
 */

import React from 'react';
import { jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';

import ContestCardRaw from '../../components/ContestCard.jsx';

// Shared mock for react-router-dom's useNavigate so we can assert handleAction behavior
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Normalize default export (function vs { default })
const ContestCard = typeof ContestCardRaw === 'function' ? ContestCardRaw : ContestCardRaw.default;

// Tests mirror backend Jest style (describe/it, minimal mocks),
// using React Testing Library only to inspect rendered output.

describe('ContestCard component', () => {
  const baseContest = {
    id: 1,
    title: 'Sample Contest',
    description: 'A great contest',
    status: 'PUBLISHED',
    start_time: '2025-01-01T10:00:00.000Z',
    end_time: '2025-01-02T10:00:00.000Z',
    has_submitted: false,
    question_count: 10,
    participant_count: 42,
  };

  it('renders core contest info (title, status, dates, stats)', () => {
    render(<ContestCard contest={baseContest} isAdmin={false} />);

    // Title
    expect(screen.getByText('Sample Contest')).not.toBeNull();

    // Status badge
    expect(screen.getByText('PUBLISHED')).not.toBeNull();

    // Description
    expect(screen.getByText('A great contest')).not.toBeNull();

    // Dates (we only assert that formatted parts are present)
    expect(screen.getByText((t) => t.startsWith('Start:'))).not.toBeNull();
    expect(screen.getByText((t) => t.startsWith('End:'))).not.toBeNull();

    // Stats
    expect(screen.getByText('10 Questions')).not.toBeNull();
    expect(screen.getByText('42 Participants')).not.toBeNull();
  });

  it('shows admin action button as Manage and enabled', () => {
    render(<ContestCard contest={{ ...baseContest, status: 'ACTIVE' }} isAdmin={true} />);

    const button = screen.getByRole('button', { name: /manage/i });
    expect(button).not.toBeNull();
    expect(button.disabled).toBe(false);
  });

  it('shows Coming Soon and disables action for learner when contest is PUBLISHED and not submitted', () => {
    render(<ContestCard contest={{ ...baseContest, status: 'PUBLISHED', has_submitted: false }} isAdmin={false} />);

    const button = screen.getByRole('button', { name: /coming soon/i });
    expect(button).not.toBeNull();
    expect(button.disabled).toBe(true);
  });

  it('shows Start Contest and enables action when contest is ACTIVE and within time window', () => {
    // Choose wide window around "now" so isContestActive is true
    const activeContest = {
      ...baseContest,
      status: 'ACTIVE',
      start_time: '2000-01-01T00:00:00.000Z',
      end_time: '2100-01-01T00:00:00.000Z',
      has_submitted: false,
    };

    render(<ContestCard contest={activeContest} isAdmin={false} />);

    const button = screen.getByRole('button', { name: /start contest/i });
    expect(button).not.toBeNull();
    expect(button.disabled).toBe(false);
  });

  it('shows View Results and enables action when learner has submitted', () => {
    const submittedContest = {
      ...baseContest,
      status: 'ACTIVE',
      has_submitted: true,
    };

    render(<ContestCard contest={submittedContest} isAdmin={false} />);

    const button = screen.getByRole('button', { name: /view results/i });
    expect(button).not.toBeNull();
    expect(button.disabled).toBe(false);
  });

  it('shows View Leaderboard for ended contest where learner has not submitted', () => {
    const endedContest = {
      ...baseContest,
      status: 'ENDED',
      has_submitted: false,
    };

    render(<ContestCard contest={endedContest} isAdmin={false} />);

    const button = screen.getByRole('button', { name: /view leaderboard/i });
    expect(button).not.toBeNull();
    // Ended contest should still allow viewing leaderboard
    expect(button.disabled).toBe(false);
  });

  it('applies correct status color classes for different statuses', () => {
    const { rerender, container } = render(
      <ContestCard contest={{ ...baseContest, status: 'DRAFT' }} isAdmin={false} />
    );

    const badge = container.querySelector('span.rounded-full');
    expect(badge.className).toContain('bg-slate-800/70');

    rerender(<ContestCard contest={{ ...baseContest, status: 'PUBLISHED' }} isAdmin={false} />);
    expect(badge.className).toContain('bg-blue-500/20');

    rerender(<ContestCard contest={{ ...baseContest, status: 'ACTIVE' }} isAdmin={false} />);
    expect(badge.className).toContain('bg-emerald-500/20');

    rerender(<ContestCard contest={{ ...baseContest, status: 'ENDED' }} isAdmin={false} />);
    expect(badge.className).toContain('bg-red-500/20');
  });

  it('falls back to default status color for unknown status', () => {
    const { container } = render(
      <ContestCard contest={{ ...baseContest, status: 'UNKNOWN' }} isAdmin={false} />
    );

    const badge = container.querySelector('span.rounded-full');
    expect(badge.className).toContain('bg-slate-800/70');
    expect(badge.className).toContain('text-slate-100');
  });

  it('navigates correctly for admin, submitted, active and ended contests', () => {
    mockNavigate.mockClear();

    // Admin path
    const { rerender } = render(
      <ContestCard contest={{ ...baseContest, status: 'ACTIVE' }} isAdmin={true} />
    );
    fireEvent.click(screen.getByRole('button', { name: /manage/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/contest/1');

    mockNavigate.mockClear();

    // Learner submitted -> results
    rerender(
      <ContestCard
        contest={{ ...baseContest, status: 'ACTIVE', has_submitted: true }}
        isAdmin={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /view results/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/contests/1/result');

    mockNavigate.mockClear();

    // Learner active and within time window -> contest page
    rerender(
      <ContestCard
        contest={{
          ...baseContest,
          status: 'ACTIVE',
          has_submitted: false,
          start_time: '2000-01-01T00:00:00.000Z',
          end_time: '2100-01-01T00:00:00.000Z',
        }}
        isAdmin={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /start contest/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/contests/1');

    mockNavigate.mockClear();

    // Learner ended contest, not submitted -> leaderboard
    rerender(
      <ContestCard
        contest={{ ...baseContest, status: 'ENDED', has_submitted: false }}
        isAdmin={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /view leaderboard/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/contests/1/leaderboard');
  });

  it('defaults isAdmin to false when not provided', () => {
    // Render without isAdmin prop to test default parameter
    render(<ContestCard contest={{ ...baseContest, status: 'ACTIVE', has_submitted: false, start_time: '2000-01-01T00:00:00.000Z', end_time: '2100-01-01T00:00:00.000Z' }} />);

    // Should show learner button (Start Contest), not admin button (Manage)
    const button = screen.getByRole('button', { name: /start contest/i });
    expect(button).not.toBeNull();
  });
});
