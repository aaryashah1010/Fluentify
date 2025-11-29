/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContestBrowsePage from '../../../../modules/learner/contests/ContestBrowsePage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseAvailableContests = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../hooks/useContest', () => ({
    useAvailableContests: () => mockUseAvailableContests(),
}));

jest.mock('../../../../components/ContestCard', () => {
    return function MockContestCard({ contest }) {
        return <div data-testid={`contest-card-${contest.id}`}>{contest.title}</div>;
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
    Users: () => <div data-testid="users-icon">Users</div>,
    Award: () => <div data-testid="award-icon">Award</div>,
    Target: () => <div data-testid="target-icon">Target</div>,
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
}));

describe('ContestBrowsePage', () => {
    const mockContests = [
        {
            id: 1,
            title: 'Spanish Grammar Contest',
            status: 'ACTIVE',
            participant_count: 25,
            has_submitted: false,
        },
        {
            id: 2,
            title: 'French Vocabulary Challenge',
            status: 'ACTIVE',
            participant_count: 30,
            has_submitted: true,
        },
        {
            id: 3,
            title: 'Closed Contest',
            status: 'CLOSED',
            participant_count: 10,
            has_submitted: false,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state', () => {
        mockUseAvailableContests.mockReturnValue({
            data: [],
            isLoading: true,
            isError: false,
        });

        render(<ContestBrowsePage />);

        expect(screen.getByText('Loading contests...')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUseAvailableContests.mockReturnValue({
            data: [],
            isLoading: false,
            isError: true,
        });

        render(<ContestBrowsePage />);

        expect(screen.getByText('Unable to load contests')).toBeInTheDocument();
        expect(screen.getByText('Please try again later.')).toBeInTheDocument();
    });

    it('should navigate to dashboard when back button clicked in error state', () => {
        mockUseAvailableContests.mockReturnValue({
            data: [],
            isLoading: false,
            isError: true,
        });

        render(<ContestBrowsePage />);

        const backButton = screen.getByText('Back to Dashboard');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should render contests list', () => {
        mockUseAvailableContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
            isError: false,
        });

        render(<ContestBrowsePage />);

        expect(screen.getByText('Contests & Competitions')).toBeInTheDocument();
        expect(screen.getByText('Spanish Grammar Contest')).toBeInTheDocument();
        expect(screen.getByText('French Vocabulary Challenge')).toBeInTheDocument();
        expect(screen.getByText('Closed Contest')).toBeInTheDocument();
    });

    it('should display correct active contests count', () => {
        mockUseAvailableContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
            isError: false,
        });

        render(<ContestBrowsePage />);

        // 2 active contests
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Active Contests')).toBeInTheDocument();
    });

    it('should calculate total participants correctly', () => {
        mockUseAvailableContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
            isError: false,
        });

        render(<ContestBrowsePage />);

        // 25 + 30 + 1 (has_submitted) + 10 = 66 total participants
        expect(screen.getByText('66')).toBeInTheDocument();
        expect(screen.getByText('Total Participants')).toBeInTheDocument();
    });

    it('should handle empty contests array', () => {
        mockUseAvailableContests.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        });

        render(<ContestBrowsePage />);

        expect(screen.getByText('No contests available')).toBeInTheDocument();
        expect(screen.getByText('New contests will appear here once they are published. Please check back later.')).toBeInTheDocument();
    });

    it('should navigate to dashboard when back button clicked', () => {
        mockUseAvailableContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
            isError: false,
        });

        render(<ContestBrowsePage />);

        const backButtons = screen.getAllByText('Back to Dashboard');
        fireEvent.click(backButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle empty contests data', () => {
        mockUseAvailableContests.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
        });

        render(<ContestBrowsePage />);

        // Should show 0 for active contests and 0 for total participants
        const zeros = screen.getAllByText('0');
        expect(zeros.length).toBeGreaterThanOrEqual(2);
    });
});
