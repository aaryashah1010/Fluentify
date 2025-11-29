/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContestResultPage from '../../../../modules/learner/contests/ContestResultPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseUserContestResult = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../../../../hooks/useContest', () => ({
    useUserContestResult: (id) => mockUseUserContestResult(id),
}));

jest.mock('../../../../components', () => ({
    Button: ({ children, onClick, className }) => (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
    XCircle: () => <div data-testid="x-circle-icon">XCircle</div>,
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    Award: () => <div data-testid="award-icon">Award</div>,
}));

describe('ContestResultPage', () => {
    const mockResultData = {
        contest: {
            id: 1,
            title: 'Spanish Grammar Contest',
        },
        result: {
            score: 85,
            rank: 5,
            time_taken_ms: 125000, // 2m 5s
        },
        submissions: [
            {
                question_id: 1,
                question_text: 'What is "hello" in Spanish?',
                options: ['Hola', 'Adios', 'Gracias', 'Por favor'],
                selected_option_id: 0,
                correct_option_id: 0,
                is_correct: true,
            },
            {
                question_id: 2,
                question_text: 'What is "goodbye" in Spanish?',
                options: ['Hola', 'Adios', 'Gracias', 'Por favor'],
                selected_option_id: 2,
                correct_option_id: 1,
                is_correct: false,
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ contestId: '1' });
    });

    it('should render loading state', () => {
        mockUseUserContestResult.mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('Loading results...')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUseUserContestResult.mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('Unable to load results')).toBeInTheDocument();
        expect(screen.getByText('Please go back and try again.')).toBeInTheDocument();
    });

    it('should render contest results with title', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('Spanish Grammar Contest')).toBeInTheDocument();
    });

    it('should display score', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('85')).toBeInTheDocument();
        expect(screen.getByText('Score')).toBeInTheDocument();
    });

    it('should display correct answers count', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('1/2')).toBeInTheDocument();
        expect(screen.getByText('Correct')).toBeInTheDocument();
    });

    it('should display rank', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('#5')).toBeInTheDocument();
        expect(screen.getByText('Rank')).toBeInTheDocument();
    });

    it('should display formatted time taken', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('2m 5s')).toBeInTheDocument();
        expect(screen.getByText('Time Taken')).toBeInTheDocument();
    });

    it('should display accuracy percentage', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText(/Accuracy:/)).toBeInTheDocument();
    });

    it('should display question review', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('Question Review')).toBeInTheDocument();
        expect(screen.getByText(/What is "hello" in Spanish\?/)).toBeInTheDocument();
        expect(screen.getByText(/What is "goodbye" in Spanish\?/)).toBeInTheDocument();
    });

    it('should show correct answer indicator', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        const correctAnswerLabels = screen.getAllByText('Correct Answer');
        expect(correctAnswerLabels.length).toBeGreaterThan(0);
    });

    it('should show incorrect answer indicator', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('Your Answer')).toBeInTheDocument();
    });

    it('should navigate to leaderboard when leaderboard button clicked', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        const leaderboardButton = screen.getByText('Leaderboard');
        fireEvent.click(leaderboardButton);

        expect(mockNavigate).toHaveBeenCalledWith('/contests/1/leaderboard');
    });

    it('should navigate to contests when back button clicked', () => {
        mockUseUserContestResult.mockReturnValue({
            data: mockResultData,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/contests');
    });

    it('should handle missing rank', () => {
        const dataWithoutRank = {
            ...mockResultData,
            result: { ...mockResultData.result, rank: null },
        };

        mockUseUserContestResult.mockReturnValue({
            data: dataWithoutRank,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('#-')).toBeInTheDocument();
    });

    it('should handle zero time taken', () => {
        const dataWithZeroTime = {
            ...mockResultData,
            result: { ...mockResultData.result, time_taken_ms: 0 },
        };

        mockUseUserContestResult.mockReturnValue({
            data: dataWithZeroTime,
            isLoading: false,
            isError: false,
        });

        render(<ContestResultPage />);

        expect(screen.getByText('0m 0s')).toBeInTheDocument();
    });

    it('should apply correct color to high accuracy', () => {
        const highAccuracyData = {
            ...mockResultData,
            submissions: [
                { ...mockResultData.submissions[0], is_correct: true },
                { ...mockResultData.submissions[1], is_correct: true },
            ],
        };

        mockUseUserContestResult.mockReturnValue({
            data: highAccuracyData,
            isLoading: false,
            isError: false,
        });

        const { container } = render(<ContestResultPage />);

        // 100% accuracy should have emerald color
        const accuracyText = screen.getByText('100%');
        expect(accuracyText).toHaveClass('text-emerald-300');
    });
});
