/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModuleCourseDetailsPage from '../../../modules/learner/ModuleCourseDetailsPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUsePublishedCourseDetails = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../../../hooks/useCourses', () => ({
    usePublishedCourseDetails: (id) => mockUsePublishedCourseDetails(id),
}));

// Mock icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <span>ArrowLeft</span>,
    BookOpen: () => <span>BookOpen</span>,
    Loader2: () => <span>Loader2</span>,
    ChevronDown: () => <span>ChevronDown</span>,
    ChevronUp: () => <span>ChevronUp</span>,
    Clock: () => <span>Clock</span>,
    Award: () => <span>Award</span>,
    Play: () => <span>Play</span>,
    Target: () => <span>Target</span>,
}));

describe('ModuleCourseDetailsPage', () => {
    const mockCourseData = {
        id: 1,
        title: 'Advanced Spanish',
        description: 'Learn advanced Spanish concepts',
        level: 'Advanced',
        thumbnail_url: 'http://example.com/image.jpg',
        estimated_duration: '4 weeks',
        units: [
            {
                id: 101,
                title: 'Unit 1',
                description: 'First Unit',
                lessons: [
                    { id: 1001, title: 'Lesson 1', description: 'Intro', xp_reward: 20 },
                    { id: 1002, title: 'Lesson 2', description: 'Details', xp_reward: 30 },
                ],
            },
            {
                id: 102,
                title: 'Unit 2',
                description: 'Second Unit',
                lessons: [],
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

        render(<ModuleCourseDetailsPage />);
        expect(screen.getByText('Loading course details...')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Failed to fetch' },
        });

        render(<ModuleCourseDetailsPage />);
        expect(screen.getByText('Course Not Found')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });

    it('should render course details', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<ModuleCourseDetailsPage />);
        expect(screen.getByText('Advanced Spanish')).toBeInTheDocument();
        expect(screen.getByText('Advanced')).toBeInTheDocument();
        expect(screen.getByText('Learn advanced Spanish concepts')).toBeInTheDocument();
        expect(screen.getAllByText('2 Lessons')[0]).toBeInTheDocument(); // Total lessons
        expect(screen.getByText('2 Units')).toBeInTheDocument();
    });

    it('should toggle unit expansion', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<ModuleCourseDetailsPage />);

        // Unit 1 should be collapsed initially (lessons not visible)
        expect(screen.queryByText('Lesson 1')).not.toBeInTheDocument();

        // Click to expand Unit 1
        fireEvent.click(screen.getByText('Unit 1'));

        expect(screen.getByText('Lesson 1')).toBeInTheDocument();
        expect(screen.getByText('Lesson 2')).toBeInTheDocument();

        // Click to collapse
        fireEvent.click(screen.getByText('Unit 1'));
        expect(screen.queryByText('Lesson 1')).not.toBeInTheDocument();
    });

    it('should handle empty units', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<ModuleCourseDetailsPage />);

        // Expand Unit 2 (empty)
        fireEvent.click(screen.getByText('Unit 2'));

        expect(screen.getByText('No lessons added to this unit yet.')).toBeInTheDocument();
    });

    it('should navigate back', () => {
        mockUsePublishedCourseDetails.mockReturnValue({
            data: mockCourseData,
            isLoading: false,
            error: null,
        });

        render(<ModuleCourseDetailsPage />);

        fireEvent.click(screen.getByText('Back to Courses'));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
