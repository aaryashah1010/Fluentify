/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseCard from '../../../../modules/learner/components/CourseCard';

// Mock dependencies
const mockDeleteCourse = jest.fn();
const mockRefetch = jest.fn();

jest.mock('../../../../api/courses', () => ({
    deleteCourse: jest.fn(),
}));

jest.mock('../../../../hooks/useCourses', () => ({
    useCourses: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    BookOpen: () => <div data-testid="book-icon">BookOpen</div>,
    Flame: () => <div data-testid="flame-icon">Flame</div>,
    CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
    Trash2: () => <div data-testid="trash-icon">Trash2</div>,
    AlertTriangle: () => <div data-testid="alert-icon">AlertTriangle</div>,
}));

// Import after mocks
import * as coursesApi from '../../../../api/courses';
import * as useCourses from '../../../../hooks/useCourses';

const mockDeleteCourseFn = jest.mocked(coursesApi.deleteCourse);
const mockUseCourses = jest.mocked(useCourses.useCourses);

describe('CourseCard', () => {
    const mockOnClick = jest.fn();

    const mockCourse = {
        id: 1,
        title: 'French for Beginners',
        language: 'French',
        totalUnits: 5,
        totalLessons: 25,
        expectedDuration: '3 months',
        expertise: 'Beginner',
        difficulty: 'Easy',
        createdAt: '2024-01-01T00:00:00.000Z',
        progress: {
            progressPercentage: 45,
            currentStreak: 7,
            unitsCompleted: 2,
        },
    };

    const courseWithoutProgress = {
        id: 2,
        title: 'Spanish Basics',
        language: 'Spanish',
        totalUnits: 4,
        totalLessons: 20,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseCourses.mockReturnValue({
            refetch: mockRefetch,
        });
        global.alert = jest.fn();
        global.console.error = jest.fn();
    });

    it('should render course information', () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('French for Beginners')).toBeInTheDocument();
        expect(screen.getByText('French')).toBeInTheDocument();
        expect(screen.getByText(/5 units • 25 lessons/)).toBeInTheDocument();
        expect(screen.getByText(/3 months/)).toBeInTheDocument();
        expect(screen.getAllByText(/Beginner/)[0]).toBeInTheDocument();
    });

    it('should display progress percentage', () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Progress')).toBeInTheDocument();
        expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('should display streak and completed units', () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText(/7 day streak/)).toBeInTheDocument();
        expect(screen.getByText(/2 units done/)).toBeInTheDocument();
    });

    it('should handle course without progress', () => {
        render(
            <CourseCard
                course={courseWithoutProgress}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText(/0 day streak/)).toBeInTheDocument();
        expect(screen.getByText(/0 units done/)).toBeInTheDocument();
    });

    it('should display "Start Course" for zero progress', () => {
        render(
            <CourseCard
                course={courseWithoutProgress}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Start Course')).toBeInTheDocument();
    });

    it('should display "Continue Learning" for progress > 0', () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Continue Learning')).toBeInTheDocument();
    });

    it('should call onClick when continue/start button is clicked', () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        const button = screen.getByText('Continue Learning');
        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledWith(mockCourse);
    });

    it('should show delete confirmation modal when delete button clicked', async () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        const deleteButton = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Delete Course?')).toBeInTheDocument();
            expect(screen.getByText(/This will permanently delete "French for Beginners"/)).toBeInTheDocument();
        });
    });

    it('should cancel delete when Cancel button clicked', async () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        // Open modal
        const deleteButton = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Delete Course?')).toBeInTheDocument();
        });

        // Click Cancel
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByText('Delete Course?')).not.toBeInTheDocument();
        });

        expect(mockDeleteCourseFn).not.toHaveBeenCalled();
    });

    it('should delete course when confirmed', async () => {
        mockDeleteCourseFn.mockResolvedValue({});

        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        // Open modal
        const deleteButton = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Delete Course?')).toBeInTheDocument();
        });

        // Click Delete
        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteCourseFn).toHaveBeenCalledWith(1);
            expect(mockRefetch).toHaveBeenCalled();
        });
    });

    it('should handle delete failure', async () => {
        mockDeleteCourseFn.mockRejectedValue(new Error('Delete failed'));

        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        // Open modal
        const deleteButton = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Delete Course?')).toBeInTheDocument();
        });

        // Click Delete
        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteCourseFn).toHaveBeenCalled();
            expect(global.alert).toHaveBeenCalledWith('Failed to delete course. Please try again.');
        });
    });

    it('should display created date if available', () => {
        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('1/1/2024')).toBeInTheDocument();
    });

    it('should use difficulty if expertise not available', () => {
        const courseWithDifficulty = {
            ...mockCourse,
            expertise: undefined,
            difficulty: 'Hard',
        };

        render(
            <CourseCard
                course={courseWithDifficulty}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText(/Hard/)).toBeInTheDocument();
    });

    it('should default to "Beginner" if neither expertise nor difficulty is set', () => {
        const courseWithoutDifficulty = {
            ...mockCourse,
            expertise: undefined,
            difficulty: undefined,
        };

        render(
            <CourseCard
                course={courseWithoutDifficulty}
                onClick={mockOnClick}
            />
        );

        expect(screen.getAllByText(/Beginner/)[0]).toBeInTheDocument();
    });

    it('should show "Deleting..." when delete is in progress', async () => {
        let resolveDelete;
        const deletePromise = new Promise((resolve) => {
            resolveDelete = resolve;
        });
        mockDeleteCourseFn.mockReturnValue(deletePromise);

        render(
            <CourseCard
                course={mockCourse}
                onClick={mockOnClick}
            />
        );

        // Open modal and start delete
        const deleteButton = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Delete Course?')).toBeInTheDocument();
        });

        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.getByText('Deleting...')).toBeInTheDocument();
        });

        // Resolve the delete
        resolveDelete({});
    });
});
