/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublishedCourseList from '../../../../modules/learner/components/PublishedCourseList';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUsePublishedCoursesByLanguage = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../../../../hooks/useCourses', () => ({
    usePublishedCoursesByLanguage: (lang) => mockUsePublishedCoursesByLanguage(lang),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
    ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
}));

describe('PublishedCourseList', () => {
    const mockCourses = [
        {
            id: 1,
            title: 'Spanish 101',
            description: 'Intro to Spanish',
            level: 'Beginner',
            total_units: 5,
            total_lessons: 25,
            thumbnail_url: 'http://example.com/spanish.jpg',
        },
        {
            id: 2,
            title: 'Spanish 102',
            description: 'Intermediate Spanish',
            level: 'Intermediate',
            total_units: 4,
            total_lessons: 20,
            thumbnail_url: null,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ language: 'Spanish' });
    });

    it('should render loading state', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        });

        render(<PublishedCourseList />);

        expect(screen.getByText('Loading Spanish courses...')).toBeInTheDocument();
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [],
            isLoading: false,
            error: { message: 'Failed to fetch' },
        });

        render(<PublishedCourseList />);

        expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should render list of courses', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: mockCourses,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseList />);

        expect(screen.getByText('Spanish')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('Spanish 101')).toBeInTheDocument();
        expect(screen.getByText('Spanish 102')).toBeInTheDocument();

        // Check thumbnail
        const img = screen.getByAltText('Spanish 101');
        expect(img).toHaveAttribute('src', 'http://example.com/spanish.jpg');

        // Check default thumbnail
        expect(screen.getAllByTestId('book-open-icon')).toHaveLength(1); // One for the course without image
    });

    it('should render empty state when no courses found', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseList />);

        expect(screen.getByText('No courses found for Spanish')).toBeInTheDocument();
        expect(screen.getByText('Check back soon for new instructor-led courses.')).toBeInTheDocument();
    });

    it('should navigate back when back button clicked', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseList />);

        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/learner/modules');
    });

    it('should navigate to course details when course card clicked', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: mockCourses,
            isLoading: false,
            error: null,
        });

        render(<PublishedCourseList />);

        const courseCard = screen.getByText('Spanish 101').closest('div.cursor-pointer');
        fireEvent.click(courseCard);

        expect(mockNavigate).toHaveBeenCalledWith('/learner/course/1');
    });
});
