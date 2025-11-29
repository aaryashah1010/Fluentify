/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LessonPage from '../../../modules/learner/LessonPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseQueryClient = jest.fn();
const mockInvalidateQueries = jest.fn();

const mockGenerateExercisesMutate = jest.fn();
const mockCompleteLessonMutate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries,
    }),
}));

jest.mock('../../../hooks/useCourses', () => ({
    useLessonDetails: jest.fn(),
    useGenerateExercises: () => ({
        mutate: mockGenerateExercisesMutate,
        isPending: false,
    }),
    useCompleteLesson: () => ({
        mutate: mockCompleteLessonMutate,
        isPending: false,
        data: { data: { unitCompleted: false } },
    }),
}));

// Mock components
jest.mock('../../../components', () => ({
    PageHeader: () => <div data-testid="page-header">PageHeader</div>,
    Button: ({ children, onClick, disabled, loading }) => (
        <button onClick={onClick} disabled={disabled || loading}>
            {loading ? 'Loading...' : children}
        </button>
    ),
    SkeletonPageHeader: () => <div data-testid="skeleton-header">SkeletonHeader</div>,
    SkeletonCard: () => <div data-testid="skeleton-card">SkeletonCard</div>,
    SkeletonText: () => <div data-testid="skeleton-text">SkeletonText</div>,
    FloatingChatWidget: () => <div data-testid="floating-chat-widget">ChatWidget</div>,
}));

// Mock icons
jest.mock('lucide-react', () => ({
    BookOpen: () => <span>BookOpen</span>,
    Target: () => <span>Target</span>,
    Play: () => <span>Play</span>,
    RotateCcw: () => <span>RotateCcw</span>,
    Award: () => <span>Award</span>,
    CheckCircle: () => <span>CheckCircle</span>,
    XCircle: () => <span>XCircle</span>,
    AlertCircle: () => <span>AlertCircle</span>,
}));

// Import the mocked hook to change its return value
import { useLessonDetails } from '../../../hooks/useCourses';

describe('LessonPage', () => {
    const mockLessonData = {
        data: {
            lesson: {
                id: 1,
                title: 'Test Lesson',
                description: 'Test Description',
                xpReward: 50,
                vocabulary: [
                    { word: 'Hola', translation: 'Hello', pronunciation: 'oh-la', example: 'Hola mundo' },
                ],
                grammarPoints: [
                    { title: 'Verbs', explanation: 'Verb explanation', examples: ['Example 1'] },
                ],
                exercises: [
                    {
                        question: 'What is Hola?',
                        options: ['Hello', 'Bye', 'Good', 'Bad'],
                        correctAnswer: 0,
                        explanation: 'Hola means Hello',
                    },
                    {
                        question: 'Q2', options: ['A', 'B', 'C', 'D'], correctAnswer: 1,
                    },
                    {
                        question: 'Q3', options: ['A', 'B', 'C', 'D'], correctAnswer: 2,
                    },
                    {
                        question: 'Q4', options: ['A', 'B', 'C', 'D'], correctAnswer: 3,
                    },
                    {
                        question: 'Q5', options: ['A', 'B', 'C', 'D'], correctAnswer: 0,
                    },
                ],
            },
            progress: {
                is_completed: false,
                score: 0,
                xp_earned: 0,
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ courseId: '1', unitId: '10', lessonId: '100' });
        useLessonDetails.mockReturnValue({
            data: mockLessonData,
            isLoading: false,
            error: null,
        });
        window.scrollTo = jest.fn();
    });

    it('should render loading state', () => {
        useLessonDetails.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        render(<LessonPage />);
        expect(screen.getByTestId('skeleton-header')).toBeInTheDocument();
    });

    it('should render error state', () => {
        useLessonDetails.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Failed to load' },
        });

        render(<LessonPage />);
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('should render lesson content', () => {
        render(<LessonPage />);
        expect(screen.getByText('Test Lesson')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Learn New Words')).toBeInTheDocument();
    });

    it('should switch sections', () => {
        render(<LessonPage />);

        // Default is vocabulary
        expect(screen.getByText('Hola')).toBeInTheDocument();

        // Switch to grammar
        fireEvent.click(screen.getByText('Grammar Rules'));
        expect(screen.getByText('Verbs')).toBeInTheDocument();

        // Switch to exercises
        fireEvent.click(screen.getByText('Practice Exercise'));
        expect(screen.getByText('Exercises (Need 3/5 Correct to Pass)')).toBeInTheDocument();
    });

    it('should handle exercise interaction and submission (pass)', async () => {
        const { container } = render(<LessonPage />);
        fireEvent.click(screen.getByText('Practice Exercise'));

        // Answer questions correctly (need 3/5)
        // Q1: Correct is 0 (Hello)
        const q1Options = container.querySelectorAll('input[name="exercise-0"]');
        fireEvent.click(q1Options[0]);

        // Q2: Correct is 1
        const q2Options = container.querySelectorAll('input[name="exercise-1"]');
        fireEvent.click(q2Options[1]);

        // Q3: Correct is 2
        const q3Options = container.querySelectorAll('input[name="exercise-2"]');
        fireEvent.click(q3Options[2]);

        // Q4: Correct is 3
        const q4Options = container.querySelectorAll('input[name="exercise-3"]');
        fireEvent.click(q4Options[3]);

        // Q5: Correct is 0
        const q5Options = container.querySelectorAll('input[name="exercise-4"]');
        fireEvent.click(q5Options[0]);

        // Submit
        fireEvent.click(screen.getByText('Submit Answers'));

        expect(screen.getByText(/Passed!/)).toBeInTheDocument();

        // Finish Lesson button should be enabled
        const finishButton = screen.getByText('Finish Lesson');
        expect(finishButton).not.toBeDisabled();

        fireEvent.click(finishButton);

        expect(mockCompleteLessonMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                courseId: 1,
                unitId: 10,
                lessonId: 100,
                score: 100,
            }),
            expect.any(Object)
        );
    });

    it('should handle exercise interaction and submission (fail)', async () => {
        const { container } = render(<LessonPage />);
        fireEvent.click(screen.getByText('Practice Exercise'));

        // Answer all wrong
        const q1Options = container.querySelectorAll('input[name="exercise-0"]');
        fireEvent.click(q1Options[1]); // Wrong

        const q2Options = container.querySelectorAll('input[name="exercise-1"]');
        fireEvent.click(q2Options[0]); // Wrong

        const q3Options = container.querySelectorAll('input[name="exercise-2"]');
        fireEvent.click(q3Options[0]); // Wrong

        const q4Options = container.querySelectorAll('input[name="exercise-3"]');
        fireEvent.click(q4Options[0]); // Wrong

        const q5Options = container.querySelectorAll('input[name="exercise-4"]');
        fireEvent.click(q5Options[1]); // Wrong

        fireEvent.click(screen.getByText('Submit Answers'));

        expect(screen.getByText(/Failed/)).toBeInTheDocument();

        // Finish Lesson button should be disabled
        const finishButton = screen.getByText('Finish Lesson');
        expect(finishButton).toBeDisabled();
    });

    it('should allow generating exercises if none exist', () => {
        const noExercisesData = {
            ...mockLessonData,
            data: {
                ...mockLessonData.data,
                lesson: {
                    ...mockLessonData.data.lesson,
                    exercises: [],
                },
            },
        };
        useLessonDetails.mockReturnValue({
            data: noExercisesData,
            isLoading: false,
            error: null,
        });

        render(<LessonPage />);

        // Should automatically switch to exercises tab if not completed and no exercises?
        // The useEffect logic: if (!completed && exercises.length === 0) setCurrentSection('exercises')

        expect(screen.getByText('Exercises Need to be Generated')).toBeInTheDocument();

        const generateButton = screen.getAllByText('Generate Exercises')[0];
        fireEvent.click(generateButton);

        expect(mockGenerateExercisesMutate).toHaveBeenCalled();
    });

    it('should show completed state', () => {
        const completedData = {
            ...mockLessonData,
            data: {
                ...mockLessonData.data,
                progress: {
                    is_completed: true,
                    score: 90,
                    xp_earned: 50,
                },
            },
        };
        useLessonDetails.mockReturnValue({
            data: completedData,
            isLoading: false,
            error: null,
        });

        render(<LessonPage />);

        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('Score: 90%')).toBeInTheDocument();
    });
});
