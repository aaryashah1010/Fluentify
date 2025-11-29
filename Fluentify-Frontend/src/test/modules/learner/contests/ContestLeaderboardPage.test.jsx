/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContestLeaderboardPage from '../../../../modules/learner/contests/ContestLeaderboardPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseLeaderboard = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../../../../hooks/useContest', () => ({
    useLeaderboard: (id) => mockUseLeaderboard(id),
}));

jest.mock('../../../../components/LeaderboardTable', () => {
    return function MockLeaderboardTable({ leaderboard }) {
        return (
            <div data-testid="leaderboard-table">
                {leaderboard.map((entry, index) => (
                    <div key={index} data-testid={`leaderboard-entry-${index}`}>
                        {entry.username}
                    </div>
                ))}
            </div>
        );
    };
});

jest.mock('../../../../components', () => ({
    Button: ({ children, onClick, className }) => (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
}));

describe('ContestLeaderboardPage', () => {
    const mockLeaderboardData = {
        contest: {
            id: 1,
            title: 'Spanish Grammar Contest',
        },
        leaderboard: [
            { rank: 1, username: 'Alice', score: 100 },
            { rank: 2, username: 'Bob', score: 90 },
            { rank: 3, username: 'Charlie', score: 85 },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ contestId: '1' });
    });

    it('should render loading state', () => {
        mockUseLeaderboard.mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('Loading leaderboard...')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUseLeaderboard.mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('Unable to load leaderboard')).toBeInTheDocument();
        expect(screen.getByText('Please try again later.')).toBeInTheDocument();
    });

    it('should navigate to contests when back button clicked in error state', () => {
        mockUseLeaderboard.mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
        });

        render(<ContestLeaderboardPage />);

        const backButton = screen.getByText('Back to Contests');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/contests');
    });

    it('should render leaderboard with contest title', () => {
        mockUseLeaderboard.mockReturnValue({
            data: mockLeaderboardData,
            isLoading: false,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('Spanish Grammar Contest')).toBeInTheDocument();
        expect(screen.getByText('Rankings')).toBeInTheDocument();
    });

    it('should display leaderboard entries', () => {
        mockUseLeaderboard.mockReturnValue({
            data: mockLeaderboardData,
            isLoading: false,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('should display participant count', () => {
        mockUseLeaderboard.mockReturnValue({
            data: mockLeaderboardData,
            isLoading: false,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('3 participants')).toBeInTheDocument();
    });

    it('should display singular participant text when count is 1', () => {
        mockUseLeaderboard.mockReturnValue({
            data: {
                contest: { id: 1, title: 'Test Contest' },
                leaderboard: [{ rank: 1, username: 'Alice', score: 100 }],
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('1 participant')).toBeInTheDocument();
    });

    it('should navigate to contests when back button clicked', () => {
        mockUseLeaderboard.mockReturnValue({
            data: mockLeaderboardData,
            isLoading: false,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/contests');
    });

    it('should handle empty leaderboard', () => {
        mockUseLeaderboard.mockReturnValue({
            data: {
                contest: { id: 1, title: 'Empty Contest' },
                leaderboard: [],
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('0 participants')).toBeInTheDocument();
    });

    it('should handle missing contest data', () => {
        mockUseLeaderboard.mockReturnValue({
            data: {
                leaderboard: [],
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestLeaderboardPage />);

        expect(screen.getByText('Contest Leaderboard')).toBeInTheDocument();
    });
});
