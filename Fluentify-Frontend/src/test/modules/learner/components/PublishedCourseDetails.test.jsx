/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublishedCourseDetails from '../../../../modules/learner/components/PublishedCourseDetails';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUsePublishedCourseDetails = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../../../../hooks/useCourses', () => ({
    usePublishedCourseDetails: (id) => mockUsePublishedCourseDetails(id),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
    ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
    ChevronUp: () => <div data-testid="chevron-up-icon">ChevronUp</div>,
}));

describe('PublishedCourseDetails', () => {
    const mockCourse = {
        id: 1,
        title: 'Advanced Spanish',
        language: 'Spanish',
        level: 'Advanced',
        description: 'Master Spanish grammar and vocabulary',
        thumbnail_url: 'http://example.com/image.jpg',
        total_units: 5,
        total_lessons: 20,
        estimated_duration: '3 months',
        units: [
            {
                id: 101,
                title: 'Unit 1: Grammar',
                description: 'Advanced grammar rules',
                lessons: [
                    {
                        id: 201,
                        title: 'Subjunctive Mood',
                        description: 'Learn when to use subjunctive',
                        content_type: 'Grammar',
                        xp_reward: 50,
                    },
                    {
                        id: 202,
                        title: 'Conditional Tense',
                        description: 'Expressing hypothetical situations',
                        content_type: 'Grammar',
                        xp_reward: 50,
                    },
                ],
            },
            {
                id: 102,
                title: 'Unit 2: Vocabulary',
                description: 'Business vocabulary',
                lessons: [], // Empty unit
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ courseId: '1' });
    });

    it('should render loading state', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        render(<PublishedCourseDetails />);

        expect(screen.getByText('Loading course details...')).toBeInTheDocument();
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Failed to fetch' },
        });

        render(<PublishedCourseDetails />);

        expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
        expect(screen.getByText('Back to Modules')).toBeInTheDocument();
    });

    it('should render course not found when data is missing', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);

        expect(screen.getByText('Error: Course not found')).toBeInTheDocument();
    });

    it('should render course details correctly', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourse,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);

        expect(screen.getByText('Advanced Spanish')).toBeInTheDocument();
        expect(screen.getAllByText(/Spanish/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Advanced/)[0]).toBeInTheDocument();
        expect(screen.getByText('Master Spanish grammar and vocabulary')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Units
        expect(screen.getByText('20')).toBeInTheDocument(); // Lessons
        expect(screen.getByText('3 months')).toBeInTheDocument(); // Duration

        // Thumbnail
        const img = screen.getByAltText('Advanced Spanish');
        expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');
    });

    it('should render default thumbnail if url missing', () => {
        const courseWithoutImage = { ...mockCourse, thumbnail_url: null };
        mockUsePublishedCourseDetails.mockReturnValue({
            data: courseWithoutImage,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);

        expect(screen.getByTestId('book-open-icon')).toBeInTheDocument();
    });

    it('should navigate back when back button clicked', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourse,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);

        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should navigate back to modules on error page', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Error' },
        });

        render(<PublishedCourseDetails />);

        const backButton = screen.getByText('Back to Modules');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/learner/modules');
    });

    it('should show content when Start Learning is clicked', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourse,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);

        expect(screen.queryByText('Course Content')).not.toBeInTheDocument();

        const startButton = screen.getByText('Start Learning');
        fireEvent.click(startButton);

        expect(screen.getByText('Course Content')).toBeInTheDocument();
        expect(screen.getByText('Unit 1: Grammar')).toBeInTheDocument();
        expect(startButton).not.toBeInTheDocument();
    });

    it('should toggle unit expansion', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourse,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);

        // Show content first
        fireEvent.click(screen.getByText('Start Learning'));

        // Check lessons are not visible initially (expandedUnits is empty)
        expect(screen.queryByText('Subjunctive Mood')).not.toBeInTheDocument();

        // Click unit to expand
        const unitButton = screen.getByText('Unit 1: Grammar').closest('button');
        fireEvent.click(unitButton);

        // Lessons should be visible
        expect(screen.getByText('Subjunctive Mood')).toBeInTheDocument();
        expect(screen.getByText('Conditional Tense')).toBeInTheDocument();

        // Click again to collapse
        fireEvent.click(unitButton);
        expect(screen.queryByText('Subjunctive Mood')).not.toBeInTheDocument();
    });

    it('should handle empty units', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourse,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);
        fireEvent.click(screen.getByText('Start Learning'));

        // Expand empty unit
        const unitButton = screen.getByText('Unit 2: Vocabulary').closest('button');
        fireEvent.click(unitButton);

        expect(screen.getByText('No lessons in this unit yet.')).toBeInTheDocument();
    });

    it('should handle course with no units', () => {
        const emptyCourse = { ...mockCourse, units: [] };
        mockUsePublishedCourseDetails.mockReturnValue({
            data: emptyCourse,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseDetails />);
        fireEvent.click(screen.getByText('Start Learning'));

        expect(screen.getByText('No units available in this course yet.')).toBeInTheDocument();
    });
});
