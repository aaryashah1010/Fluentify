/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate, useParams } from 'react-router-dom';
import CourseListPage from '../../../../../modules/admin/module-management/pages/CourseListPage';
import { useModuleManagement } from '../../../../../hooks/useModuleManagement';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('../../../../../hooks/useModuleManagement', () => ({
    useModuleManagement: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Plus: () => <div data-testid="plus-icon">Plus</div>,
    Edit: () => <div data-testid="edit-icon">Edit</div>,
    Trash2: () => <div data-testid="trash-icon">Trash</div>,
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
    Loader2: () => <div data-testid="loader-icon">Loader</div>,
    CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
    XCircle: () => <div data-testid="x-circle-icon">XCircle</div>,
}));

describe('CourseListPage', () => {
    const mockNavigate = jest.fn();
    const mockFetchCoursesByLanguage = jest.fn();
    const mockDeleteCourse = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useParams.mockReturnValue({ language: 'French' });

        useModuleManagement.mockReturnValue({
            courses: [],
            loading: false,
            error: null,
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });
    });

    it('should render loading state', () => {
        useModuleManagement.mockReturnValue({
            courses: [],
            loading: true,
            error: null,
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });

        render(<CourseListPage />);
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render error state', () => {
        useModuleManagement.mockReturnValue({
            courses: [],
            loading: false,
            error: 'Failed to fetch courses',
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });

        render(<CourseListPage />);
        expect(screen.getByText('Error: Failed to fetch courses')).toBeInTheDocument();
    });

    it('should render empty state', () => {
        render(<CourseListPage />);
        expect(screen.getByText('No courses found for French')).toBeInTheDocument();

        const createButton = screen.getByText('Create First Course');
        fireEvent.click(createButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/modules/course/new?language=French');
    });

    it('should render courses list', () => {
        const mockCourses = [
            {
                id: 1,
                title: 'Beginner French',
                description: 'Start here',
                level: 'A1',
                unit_count: 5,
                lesson_count: 20,
                is_published: true,
                thumbnail_url: 'http://example.com/image.jpg',
            },
            {
                id: 2,
                title: 'Intermediate French',
                description: 'Continue here',
                level: 'B1',
                unit_count: 0,
                lesson_count: 0,
                is_published: false,
                thumbnail_url: null,
            },
        ];

        useModuleManagement.mockReturnValue({
            courses: mockCourses,
            loading: false,
            error: null,
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });

        render(<CourseListPage />);

        expect(screen.getByText('Beginner French')).toBeInTheDocument();
        expect(screen.getByText('Intermediate French')).toBeInTheDocument();
        expect(screen.getByText('A1')).toBeInTheDocument();
        expect(screen.getByText('B1')).toBeInTheDocument();
        expect(screen.getByText('5 units')).toBeInTheDocument();
        expect(screen.getByText('0 units')).toBeInTheDocument();

        // Check icons
        expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
        expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument();
    });

    it('should navigate to create new course', () => {
        render(<CourseListPage />);
        const createButton = screen.getByText('Create New Course');
        fireEvent.click(createButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/modules/course/new?language=French');
    });

    it('should navigate back to modules list', () => {
        render(<CourseListPage />);
        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/modules');
    });

    it('should navigate to edit course', () => {
        const mockCourses = [{ id: 1, title: 'Course 1', level: 'A1' }];
        useModuleManagement.mockReturnValue({
            courses: mockCourses,
            loading: false,
            error: null,
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });

        render(<CourseListPage />);
        const editButtons = screen.getAllByText('Edit');
        const editButton = editButtons.find(el => el.closest('button'));
        fireEvent.click(editButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/modules/course/edit/1');
    });

    it('should handle course deletion', async () => {
        const mockCourses = [{ id: 1, title: 'Course 1', level: 'A1' }];
        useModuleManagement.mockReturnValue({
            courses: mockCourses,
            loading: false,
            error: null,
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });

        render(<CourseListPage />);

        // Click delete icon
        const deleteIcon = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteIcon);

        // Check modal appears
        expect(screen.getByText('Delete Course')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this course? This will also delete all units and lessons. This action cannot be undone.')).toBeInTheDocument();

        // Click confirm delete
        const deleteButtons = screen.getAllByText('Delete');
        const confirmButton = deleteButtons.find(btn => btn.closest('.bg-rose-600'));
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteCourse).toHaveBeenCalledWith(1);
            expect(mockFetchCoursesByLanguage).toHaveBeenCalledWith('French');
        });
    });

    it('should handle delete course failure', async () => {
        const mockCourses = [{ id: 1, title: 'Course 1', level: 'A1' }];
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockDeleteCourse.mockRejectedValue(new Error('Delete failed'));

        useModuleManagement.mockReturnValue({
            courses: mockCourses,
            loading: false,
            error: null,
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });

        render(<CourseListPage />);

        // Click delete icon
        const deleteIcon = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteIcon);

        // Click confirm delete
        const deleteButtons = screen.getAllByText('Delete');
        const confirmButton = deleteButtons.find(btn => btn.closest('.bg-rose-600'));
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteCourse).toHaveBeenCalledWith(1);
            expect(consoleSpy).toHaveBeenCalledWith('Failed to delete course:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should cancel course deletion', () => {
        const mockCourses = [{ id: 1, title: 'Course 1', level: 'A1' }];
        useModuleManagement.mockReturnValue({
            courses: mockCourses,
            loading: false,
            error: null,
            fetchCoursesByLanguage: mockFetchCoursesByLanguage,
            deleteCourse: mockDeleteCourse,
        });

        render(<CourseListPage />);

        // Click delete icon
        const deleteIcon = screen.getByTestId('trash-icon').closest('button');
        fireEvent.click(deleteIcon);

        // Click cancel
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(screen.queryByText('Delete Course')).not.toBeInTheDocument();
        expect(mockDeleteCourse).not.toHaveBeenCalled();
    });

    it('should fetch courses on mount', () => {
        render(<CourseListPage />);
        expect(mockFetchCoursesByLanguage).toHaveBeenCalledWith('French');
    });

    it('should not fetch courses when language is undefined', () => {
        useParams.mockReturnValue({}); // No language param
        render(<CourseListPage />);
        expect(mockFetchCoursesByLanguage).not.toHaveBeenCalled();
    });
});
