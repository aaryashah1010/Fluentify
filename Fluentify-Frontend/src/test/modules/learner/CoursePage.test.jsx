/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoursePage from '../../../modules/learner/CoursePage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseQuery = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: (options) => mockUseQuery(options),
}));

jest.mock('../../../api/courses', () => ({
    fetchCourseDetails: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    Flame: () => <div data-testid="flame-icon">Flame</div>,
    BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
    Award: () => <div data-testid="award-icon">Award</div>,
    Target: () => <div data-testid="target-icon">Target</div>,
    CheckCircle2: () => <div data-testid="check-circle-icon">CheckCircle2</div>,
    Lock: () => <div data-testid="lock-icon">Lock</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    PlayCircle: () => <div data-testid="play-circle-icon">PlayCircle</div>,
    Play: () => <div data-testid="play-icon">Play</div>,
    Check: () => <div data-testid="check-icon">Check</div>,
}));

describe('CoursePage', () => {
    const mockCourseData = {
        course: {
            id: 1,
            title: 'Spanish 101',
            language: 'Spanish',
            flag: '🇪🇸',
            units: [
                {
                    id: 101,
                    title: 'Unit 1',
                    description: 'Introduction',
                    lessons: [
                        {
                            id: 1001,
                            title: 'Lesson 1',
                            description: 'Basics',
                            duration: '10 min',
                            xp: 10,
                            status: 'completed',
                            isCompleted: true,
                        },
                        {
                            id: 1002,
                            title: 'Lesson 2',
                            description: 'Greetings',
                            duration: '15 min',
                            xp: 15,
                            status: 'active',
                            isCompleted: false,
                        },
                        {
                            id: 1003,
                            title: 'Lesson 3',
                            description: 'Numbers',
                            duration: '20 min',
                            xp: 20,
                            status: 'locked',
                            isCompleted: false,
                        },
                    ],
                },
            ],
        },
        stats: {
            current_streak: 5,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ courseId: '1' });
    });

    it('should render loading state', () => {
        mockUseQuery.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        render(<CoursePage />);

        // Check for loading spinner (by class or structure since it doesn't have text)
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUseQuery.mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Failed to load'),
        });

        render(<CoursePage />);

        expect(screen.getByText('Failed to load course.')).toBeInTheDocument();
    });

    it('should render course details correctly', () => {
        mockUseQuery.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        expect(screen.getByText('Spanish 101')).toBeInTheDocument();
        expect(screen.getAllByText(/Spanish/)[0]).toBeInTheDocument();
        expect(screen.getByText('🇪🇸')).toBeInTheDocument();
        expect(screen.getByText('Unit 1')).toBeInTheDocument();
        expect(screen.getByText('Lesson 1')).toBeInTheDocument();
        expect(screen.getByText('Lesson 2')).toBeInTheDocument();
        expect(screen.getByText('Lesson 3')).toBeInTheDocument();
    });

    it('should calculate and display progress statistics', () => {
        mockUseQuery.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        // 1 completed out of 3 total lessons = 33%
        expect(screen.getByText('33%')).toBeInTheDocument();
        expect(screen.getAllByText('1 / 3 lessons completed')[0]).toBeInTheDocument();

        // Total XP = 10 + 15 + 20 = 45
        expect(screen.getByText('45')).toBeInTheDocument();

        // Streak
        expect(screen.getByText('5 days')).toBeInTheDocument();
    });

    it('should display correct lesson statuses', () => {
        mockUseQuery.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Complete previous lessons to unlock.')).toBeInTheDocument();
    });

    it('should navigate to dashboard when back button clicked', () => {
        mockUseQuery.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        const backButton = screen.getByText('Back to Dashboard');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should navigate to lesson when "Start Lesson" clicked', () => {
        mockUseQuery.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        const startButton = screen.getByText('Start Lesson →');
        fireEvent.click(startButton);

        // Should navigate to Lesson 2 (id 1002, unit 101)
        expect(mockNavigate).toHaveBeenCalledWith(
            expect.stringContaining('/lesson/1/101/1002'),
            expect.any(Object)
        );
    });

    it('should navigate to lesson when "Review Lesson" clicked', () => {
        mockUseQuery.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        const reviewButton = screen.getByText('Review Lesson');
        fireEvent.click(reviewButton);

        // Should navigate to Lesson 1 (id 1001, unit 101)
        expect(mockNavigate).toHaveBeenCalledWith(
            expect.stringContaining('/lesson/1/101/1001'),
            expect.any(Object)
        );
    });

    it('should show "Resume Course" button for active lesson', () => {
        mockUseQuery.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        const resumeButton = screen.getByText('Resume Course');
        expect(resumeButton).toBeInTheDocument();

        fireEvent.click(resumeButton);

        // Should resume at Lesson 2 (active)
        expect(mockNavigate).toHaveBeenCalledWith(
            expect.stringContaining('/lesson/1/101/1002'),
            expect.any(Object)
        );
    });

    it('should handle missing stats or course data gracefully', () => {
        const minimalData = {
            course: {
                id: 1,
                title: 'Minimal Course',
                units: [],
            },
        };

        mockUseQuery.mockReturnValue({
            data: minimalData,
            isLoading: false,
            error: null,
        });

        render(<CoursePage />);

        expect(screen.getByText('Minimal Course')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('0 days')).toBeInTheDocument();
    });
});
