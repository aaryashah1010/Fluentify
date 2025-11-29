/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModuleCoursesPage from '../../../modules/learner/ModuleCoursesPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUsePublishedCoursesByLanguage = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
}));

jest.mock('../../../hooks/useCourses', () => ({
    usePublishedCoursesByLanguage: (language) => mockUsePublishedCoursesByLanguage(language),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    GraduationCap: () => <div data-testid="graduation-cap-icon">GraduationCap</div>,
    Signal: () => <div data-testid="signal-icon">Signal</div>,
}));

describe('ModuleCoursesPage', () => {
    const mockCourses = [
        {
            id: 1,
            title: 'Spanish 101',
            description: 'Beginner Spanish',
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

        render(<ModuleCoursesPage />);

        expect(screen.getByText('Loading Spanish courses...')).toBeInTheDocument();
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render courses list', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: mockCourses,
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        expect(screen.getAllByText(/Spanish/)[0]).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('Spanish 101')).toBeInTheDocument();
        expect(screen.getByText('Spanish 102')).toBeInTheDocument();
    });

    it('should display course details', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: mockCourses,
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        expect(screen.getByText('Beginner Spanish')).toBeInTheDocument();
        expect(screen.getByText('Intermediate Spanish')).toBeInTheDocument();
        expect(screen.getByText('5 Units')).toBeInTheDocument();
        expect(screen.getByText('25 Lessons')).toBeInTheDocument();
    });

    it('should display thumbnail when available', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: mockCourses,
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        const img = screen.getByAltText('Spanish 101');
        expect(img).toHaveAttribute('src', 'http://example.com/spanish.jpg');
    });

    it('should display fallback icon when no thumbnail', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [mockCourses[1]],
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        const bookIcons = screen.getAllByTestId('book-open-icon');
        expect(bookIcons.length).toBeGreaterThan(0);
    });

    it('should navigate to course details when card clicked', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: mockCourses,
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        const course1Card = screen.getByText('Spanish 101').closest('button');
        fireEvent.click(course1Card);

        expect(mockNavigate).toHaveBeenCalledWith('/module-course/1');
    });

    it('should navigate back to languages when back button clicked', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: mockCourses,
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        const backButton = screen.getByText('Back to Languages');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/language-modules');
    });

    it('should display empty state when no courses', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        expect(screen.getByText('No courses found')).toBeInTheDocument();
        expect(screen.getByText('Check back soon for new instructor-led content.')).toBeInTheDocument();
    });

    it('should display error message', () => {
        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [],
            isLoading: false,
            error: { message: 'Failed to load courses' },
        });

        render(<ModuleCoursesPage />);

        expect(screen.getByText('Unable to load courses')).toBeInTheDocument();
        expect(screen.getByText('Failed to load courses')).toBeInTheDocument();
    });

    it('should display default level when not provided', () => {
        const courseWithoutLevel = {
            ...mockCourses[0],
            level: null,
        };

        mockUsePublishedCoursesByLanguage.mockReturnValue({
            data: [courseWithoutLevel],
            isLoading: false,
            error: null,
        });

        render(<ModuleCoursesPage />);

        expect(screen.getByText('Beginner')).toBeInTheDocument();
    });
});
