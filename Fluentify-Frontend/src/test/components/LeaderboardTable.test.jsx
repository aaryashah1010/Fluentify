/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';

import LeaderboardTable from '../../components/LeaderboardTable.jsx';

// Tests mirror backend Jest style (describe/it, minimal mocks) and
// use React Testing Library only where necessary for DOM assertions.

describe('LeaderboardTable component', () => {
  it('renders empty state when leaderboard is null or empty', () => {
    const { container: c1 } = render(<LeaderboardTable leaderboard={null} />);
    expect(c1.querySelector('table')).toBeNull();
    expect(c1.textContent).toContain('No participants yet');

    const { container: c2 } = render(<LeaderboardTable leaderboard={[]} />);
    expect(c2.querySelector('table')).toBeNull();
    expect(c2.textContent).toContain('Be the first to participate in this contest!');
  });

  it('renders leaderboard rows with rank badges, names, scores, time, and submitted date', () => {
    const leaderboard = [
      {
        learner_id: 1,
        rank: 1,
        display_name: 'Alice',
        score: 95,
        time_taken_ms: 125000, // 2 minutes 5 seconds -> 2:05
        submitted_at: '2025-01-01T10:00:00.000Z',
      },
      {
        learner_id: 2,
        rank: 4,
        display_name: 'Bob',
        score: 80,
        time_taken_ms: 61000, // 1:01
        submitted_at: '2025-01-01T11:30:00.000Z',
      },
    ];

    const { container } = render(<LeaderboardTable leaderboard={leaderboard} />);

    // Table structure
    const table = container.querySelector('table');
    expect(table).toBeTruthy();

    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    // First row: rank 1 -> gold medal, gradient avatar initial, score, formatted time
    const firstRowText = rows[0].textContent || '';
    expect(firstRowText).toContain('🥇');
    expect(firstRowText).toContain('Alice');
    expect(firstRowText).toContain('95 points');
    expect(firstRowText).toContain('2:05');

    // Second row: rank 4 -> plain rank, no medal emoji
    const secondRowText = rows[1].textContent || '';
    expect(secondRowText).toContain('4');
    expect(secondRowText).toContain('Bob');
    expect(secondRowText).toContain('80 points');
    expect(secondRowText).toContain('1:01');

    // Avatar initial for Alice
    const avatarDivs = container.querySelectorAll('div.h-10.w-10.rounded-full');
    expect(avatarDivs.length).toBeGreaterThanOrEqual(2);
    expect(avatarDivs[0].textContent).toBe('A');
    expect(avatarDivs[1].textContent).toBe('B');
  });

  it('highlights current user row and shows "You" badge', () => {
    const leaderboard = [
      {
        learner_id: 1,
        rank: 2,
        display_name: 'Alice',
        score: 90,
        time_taken_ms: 90000,
        submitted_at: '2025-01-01T09:00:00.000Z',
      },
      {
        learner_id: 999,
        rank: 3,
        display_name: 'Current User',
        score: 85,
        time_taken_ms: 120000,
        submitted_at: '2025-01-01T09:30:00.000Z',
      },
    ];

    const { container } = render(
      <LeaderboardTable leaderboard={leaderboard} currentUserId={999} />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    // Find the row that contains "Current User" and ensure it has the highlight classes and the "You" badge
    const currentUserRow = Array.from(rows).find((row) =>
      (row.textContent || '').includes('Current User')
    );
    expect(currentUserRow).toBeTruthy();

    const rowClass = currentUserRow && currentUserRow.getAttribute('class');
    expect(rowClass || '').toContain('border-2');
    expect(rowClass || '').toContain('border-blue-500');
    expect(rowClass || '').toContain('bg-blue-50');

    const youBadge = currentUserRow && currentUserRow.querySelector('span.ml-2');
    expect(youBadge).toBeTruthy();
    expect(youBadge && youBadge.textContent).toContain('You');
  });

  it('applies special background colors for top 3 ranks', () => {
    const leaderboard = [
      { learner_id: 1, rank: 1, display_name: 'One', score: 100, time_taken_ms: 1000, submitted_at: '2025-01-01T00:00:00.000Z' },
      { learner_id: 2, rank: 2, display_name: 'Two', score: 90, time_taken_ms: 2000, submitted_at: '2025-01-01T00:00:00.000Z' },
      { learner_id: 3, rank: 3, display_name: 'Three', score: 80, time_taken_ms: 3000, submitted_at: '2025-01-01T00:00:00.000Z' },
      { learner_id: 4, rank: 4, display_name: 'Four', score: 70, time_taken_ms: 4000, submitted_at: '2025-01-01T00:00:00.000Z' },
    ];

    const { container } = render(<LeaderboardTable leaderboard={leaderboard} />);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(4);

    const classList = Array.from(rows).map((row) => row.getAttribute('class') || '');

    // Rank 1: yellow background
    expect(classList[0]).toContain('bg-yellow-50');
    expect(classList[0]).toContain('border-yellow-200');

    // Rank 2: gray background
    expect(classList[1]).toContain('bg-gray-50');
    expect(classList[1]).toContain('border-gray-200');

    // Rank 3: orange background
    expect(classList[2]).toContain('bg-orange-50');
    expect(classList[2]).toContain('border-orange-200');

    // Rank 4: no special color classes from getRankColor
    expect(classList[3]).not.toContain('bg-yellow-50');
    expect(classList[3]).not.toContain('bg-gray-50');
    expect(classList[3]).not.toContain('bg-orange-50');
  });
});
