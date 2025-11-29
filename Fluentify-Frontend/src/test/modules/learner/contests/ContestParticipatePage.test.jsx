/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContestParticipatePage from '../../../../modules/learner/contests/ContestParticipatePage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseContestDetails = jest.fn();
const mockMutateAsync = jest.fn();
const mockUseSubmitContest = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../../../../hooks/useContest', () => ({
    useContestDetails: (id) => mockUseContestDetails(id),
    useSubmitContest: () => mockUseSubmitContest(),
}));

jest.mock('../../../../components', () => ({
    Button: ({ children, onClick, disabled, className }) => (
        <button onClick={onClick} disabled={disabled} className={className}>
            {children}
        </button>
    ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
}));

describe('ContestParticipatePage', () => {
    const mockContest = {
        id: 1,
        title: 'Spanish Grammar Contest',
        end_time: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
    };

    const mockQuestions = [
        {
            id: 1,
            question_text: 'What is "hello" in Spanish?',
            options: ['Hola', 'Adios', 'Gracias', 'Por favor'],
        },
        {
            id: 2,
            question_text: 'What is "goodbye" in Spanish?',
            options: ['Hola', 'Adios', 'Gracias', 'Por favor'],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ contestId: '1' });
        mockUseSubmitContest.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });
        global.alert = jest.fn();
    });

    it('should render loading state', () => {
        mockUseContestDetails.mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
        });

        render(<ContestParticipatePage />);

        expect(screen.getByText('Loading contest...')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUseContestDetails.mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
        });

        render(<ContestParticipatePage />);

        expect(screen.getByText('Unable to load contest')).toBeInTheDocument();
        expect(screen.getByText('Please go back and try again.')).toBeInTheDocument();
    });

    it('should render contest questions', () => {
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        expect(screen.getByText('Spanish Grammar Contest')).toBeInTheDocument();
        expect(screen.getByText(/What is "hello" in Spanish\?/)).toBeInTheDocument();
        expect(screen.getByText(/What is "goodbye" in Spanish\?/)).toBeInTheDocument();
    });

    it('should allow selecting answers', () => {
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        const option1 = screen.getAllByText('Hola')[0].closest('label');
        fireEvent.click(option1);

        const radioButton = option1.querySelector('input[type="radio"]');
        expect(radioButton).toBeChecked();
    });

    it('should disable submit button when not all questions answered', () => {
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        const submitButton = screen.getByText('Submit Contest');
        expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all questions answered', async () => {
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        // Answer first question
        const option1 = screen.getAllByText('Hola')[0].closest('label');
        fireEvent.click(option1);

        // Answer second question
        const option2 = screen.getAllByText('Adios')[1].closest('label');
        fireEvent.click(option2);

        await waitFor(() => {
            const submitButton = screen.getByText('Submit Contest');
            expect(submitButton).not.toBeDisabled();
        });
    });

    it('should submit contest when all questions answered and submit clicked', async () => {
        mockMutateAsync.mockResolvedValue({});
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        // Answer both questions
        const option1 = screen.getAllByText('Hola')[0].closest('label');
        fireEvent.click(option1);

        const option2 = screen.getAllByText('Adios')[1].closest('label');
        fireEvent.click(option2);

        const submitButton = screen.getByText('Submit Contest');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                contestId: '1',
                data: expect.objectContaining({
                    submissions: expect.arrayContaining([
                        expect.objectContaining({ question_id: 1, selected_option_id: 0 }),
                        expect.objectContaining({ question_id: 2, selected_option_id: 1 }),
                    ]),
                }),
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith('/contests');
    });

    it('should display timer', () => {
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    });

    it('should handle submit error', async () => {
        mockMutateAsync.mockRejectedValue(new Error('Submission failed'));
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        // Answer both questions
        const option1 = screen.getAllByText('Hola')[0].closest('label');
        fireEvent.click(option1);

        const option2 = screen.getAllByText('Adios')[1].closest('label');
        fireEvent.click(option2);

        const submitButton = screen.getByText('Submit Contest');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Submission failed');
        });
    });

    it('should handle empty questions', () => {
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: [],
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        expect(screen.getByText('No questions available.')).toBeInTheDocument();
    });

    it('should navigate back when back button clicked', () => {
        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/contests');
    });

    it('should show submitting state', async () => {
        mockUseSubmitContest.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: true,
        });

        mockUseContestDetails.mockReturnValue({
            data: {
                contest: mockContest,
                questions: mockQuestions,
            },
            isLoading: false,
            isError: false,
        });

        render(<ContestParticipatePage />);

        expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
});
