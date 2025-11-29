/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CourseEditorPage from '../../../../../modules/admin/module-management/pages/CourseEditorPage';
import { useModuleManagement } from '../../../../../hooks/useModuleManagement';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useParams: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock('../../../../../hooks/useModuleManagement', () => ({
    useModuleManagement: jest.fn(),
}));

// Mock child components
jest.mock('../../../../../modules/admin/module-management/components/CourseForm', () => (props) => (
    <div data-testid="course-form">
        <button onClick={() => props.onChange({ ...props.courseData, title: 'Updated Course' })}>
            Update Course Data
        </button>
    </div>
));

jest.mock('../../../../../modules/admin/module-management/components/UnitList', () => (props) => (
    <div data-testid="unit-list">
        <button onClick={props.onAddUnit}>Add Unit</button>
        <button onClick={() => props.onEditUnit({ id: 1, title: 'Unit 1' })}>Edit Unit</button>
        <button onClick={() => props.onDeleteUnit(1)}>Delete Unit</button>
        <button onClick={() => props.onAddLesson(1)}>Add Lesson</button>
        <button onClick={() => props.onEditLesson({ id: 101, title: 'Lesson 1', unit_id: 1 })}>Edit Lesson</button>
        <button onClick={() => props.onDeleteLesson(101)}>Delete Lesson</button>
    </div>
));

jest.mock('../../../../../modules/admin/module-management/components/UnitForm', () => (props) => (
    <div data-testid="unit-form">
        <button onClick={props.onSubmit}>Save Unit</button>
        <button onClick={props.onCancel}>Cancel Unit</button>
    </div>
));

jest.mock('../../../../../modules/admin/module-management/components/LessonForm', () => (props) => (
    <div data-testid="lesson-form">
        <button onClick={props.onSubmit}>Save Lesson</button>
        <button onClick={props.onCancel}>Cancel Lesson</button>
    </div>
));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    Save: () => <div data-testid="save-icon">Save</div>,
    Loader2: () => <div data-testid="loader-icon">Loader</div>,
}));

describe('CourseEditorPage', () => {
    const mockNavigate = jest.fn();
    const mockSearchParams = { get: jest.fn() };

    const mockCreateCourse = jest.fn();
    const mockFetchCourseDetails = jest.fn();
    const mockUpdateCourse = jest.fn();
    const mockCreateUnit = jest.fn();
    const mockUpdateUnit = jest.fn();
    const mockDeleteUnit = jest.fn();
    const mockCreateLesson = jest.fn();
    const mockUpdateLesson = jest.fn();
    const mockDeleteLesson = jest.fn();
    const mockClearError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useParams.mockReturnValue({});
        useSearchParams.mockReturnValue([mockSearchParams]);
        mockSearchParams.get.mockReturnValue(null);

        // Default URL
        window.history.pushState({}, 'Test page', '/admin/modules/course/new');

        useModuleManagement.mockReturnValue({
            currentCourse: null,
            loading: false,
            error: null,
            createCourse: mockCreateCourse,
            fetchCourseDetails: mockFetchCourseDetails,
            updateCourse: mockUpdateCourse,
            createUnit: mockCreateUnit,
            updateUnit: mockUpdateUnit,
            deleteUnit: mockDeleteUnit,
            createLesson: mockCreateLesson,
            updateLesson: mockUpdateLesson,
            deleteLesson: mockDeleteLesson,
            clearError: mockClearError,
        });
    });

    it('should render loading state when fetching course details', () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        useModuleManagement.mockReturnValue({
            currentCourse: null,
            loading: true,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
        });

        render(<CourseEditorPage />);
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render error state', () => {
        useModuleManagement.mockReturnValue({
            currentCourse: null,
            loading: false,
            error: 'Failed to fetch course',
            fetchCourseDetails: mockFetchCourseDetails,
            clearError: mockClearError,
        });

        render(<CourseEditorPage />);
        expect(screen.getByText('Failed to fetch course')).toBeInTheDocument();

        const closeButton = screen.getByText('×');
        fireEvent.click(closeButton);
        expect(mockClearError).toHaveBeenCalled();
    });

    it('should render in "Create New Course" mode', () => {
        window.history.pushState({}, '', '/admin/modules/course/new');

        render(<CourseEditorPage />);

        expect(screen.getByText('Create New Course')).toBeInTheDocument();
        expect(screen.getByText('Save Course')).toBeInTheDocument();
        expect(screen.getByTestId('course-form')).toBeInTheDocument();
        expect(screen.queryByTestId('unit-list')).not.toBeInTheDocument();
    });

    it('should save a new course', async () => {
        window.history.pushState({}, '', '/admin/modules/course/new');
        mockCreateCourse.mockResolvedValue({ id: 1 });

        render(<CourseEditorPage />);

        // Simulate updating course data
        const updateButton = screen.getByText('Update Course Data');
        fireEvent.click(updateButton);

        const saveButton = screen.getByText('Save Course');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockCreateCourse).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Course' }));
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    it('should save a new course and navigate to language list if language param exists', async () => {
        window.history.pushState({}, '', '/admin/modules/course/new');
        mockSearchParams.get.mockReturnValue('French');
        mockCreateCourse.mockResolvedValue({ id: 1 });

        render(<CourseEditorPage />);

        const saveButton = screen.getByText('Save Course');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/modules/French');
        });
    });

    it('should render in "Edit Course" mode', () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            updateCourse: mockUpdateCourse,
        });

        render(<CourseEditorPage />);

        expect(screen.getByText('Edit Course')).toBeInTheDocument();
        expect(screen.getByTestId('unit-list')).toBeInTheDocument();
        expect(mockFetchCourseDetails).toHaveBeenCalledWith('1');
    });

    it('should update an existing course', async () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            updateCourse: mockUpdateCourse,
        });

        render(<CourseEditorPage />);

        const saveButton = screen.getByText('Save Course');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdateCourse).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    it('should render in "View Course" mode', () => {
        window.history.pushState({}, '', '/admin/modules/course/view/1');

        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
        });

        render(<CourseEditorPage />);

        expect(screen.getByText('View Course')).toBeInTheDocument();
        expect(screen.getByText('Switch to Edit Mode')).toBeInTheDocument();

        const switchButton = screen.getByText('Switch to Edit Mode');
        fireEvent.click(switchButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/course/edit/1');
    });

    // Unit Tests
    it('should open modal to add unit', () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createUnit: mockCreateUnit,
        });

        render(<CourseEditorPage />);

        const addUnitButton = screen.getByText('Add Unit');
        fireEvent.click(addUnitButton);

        expect(screen.getByText('Add New Unit')).toBeInTheDocument();
        expect(screen.getByTestId('unit-form')).toBeInTheDocument();
    });

    it('should save new unit', async () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createUnit: mockCreateUnit,
        });

        render(<CourseEditorPage />);

        // Open modal
        fireEvent.click(screen.getByText('Add Unit'));

        // Save
        fireEvent.click(screen.getByText('Save Unit'));

        await waitFor(() => {
            expect(mockCreateUnit).toHaveBeenCalled();
        });
    });

    it('should edit existing unit', async () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            updateUnit: mockUpdateUnit,
        });

        render(<CourseEditorPage />);

        // Click edit unit (mocked in UnitList)
        fireEvent.click(screen.getByText('Edit Unit'));

        const modalTitle = screen.getAllByText('Edit Unit').find(el => el.tagName === 'H3');
        expect(modalTitle).toBeInTheDocument();

        // Save
        fireEvent.click(screen.getByText('Save Unit'));

        await waitFor(() => {
            expect(mockUpdateUnit).toHaveBeenCalled();
        });
    });

    it('should delete unit', async () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            deleteUnit: mockDeleteUnit,
        });

        // Mock confirm
        window.confirm = jest.fn(() => true);

        render(<CourseEditorPage />);

        fireEvent.click(screen.getByText('Delete Unit'));

        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalled();
            expect(mockDeleteUnit).toHaveBeenCalledWith(1);
        });
    });

    // Lesson Tests
    it('should open modal to add lesson', () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createLesson: mockCreateLesson,
        });

        render(<CourseEditorPage />);

        fireEvent.click(screen.getByText('Add Lesson'));

        expect(screen.getByText('Add New Lesson')).toBeInTheDocument();
        expect(screen.getByTestId('lesson-form')).toBeInTheDocument();
    });

    it('should save new lesson', async () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createLesson: mockCreateLesson,
        });

        render(<CourseEditorPage />);

        fireEvent.click(screen.getByText('Add Lesson'));
        fireEvent.click(screen.getByText('Save Lesson'));

        await waitFor(() => {
            expect(mockCreateLesson).toHaveBeenCalled();
        });
    });

    it('should edit existing lesson', async () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            updateLesson: mockUpdateLesson,
        });

        render(<CourseEditorPage />);

        fireEvent.click(screen.getByText('Edit Lesson'));

        const modalTitle = screen.getAllByText('Edit Lesson').find(el => el.tagName === 'H3');
        expect(modalTitle).toBeInTheDocument();

        fireEvent.click(screen.getByText('Save Lesson'));

        await waitFor(() => {
            expect(mockUpdateLesson).toHaveBeenCalled();
        });
    });

    it('should delete lesson', async () => {
        window.history.pushState({}, '', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });

        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            deleteLesson: mockDeleteLesson,
        });

        // Mock confirm
        window.confirm = jest.fn(() => true);

        render(<CourseEditorPage />);

        fireEvent.click(screen.getByText('Delete Lesson'));

        await waitFor(() => {
            expect(window.confirm).toHaveBeenCalled();
            expect(mockDeleteLesson).toHaveBeenCalledWith(101);
        });
    });

    it('should navigate back when back button is clicked', () => {
        render(<CourseEditorPage />);
        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should close unit modal on cancel', async () => {
        window.history.pushState({}, 'Test page', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });
        const mockCourse = { id: 1, title: 'Existing Course', units: [] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createUnit: mockCreateUnit,
        });

        render(<CourseEditorPage />);
        fireEvent.click(screen.getByText('Add Unit'));
        expect(screen.getByText('Add New Unit')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel Unit'));
        expect(screen.queryByText('Add New Unit')).not.toBeInTheDocument();
    });

    it('should close lesson modal on cancel', async () => {
        window.history.pushState({}, 'Test page', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });
        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createLesson: mockCreateLesson,
        });

        render(<CourseEditorPage />);
        fireEvent.click(screen.getByText('Add Lesson'));
        expect(screen.getByText('Add New Lesson')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel Lesson'));
        expect(screen.queryByText('Add New Lesson')).not.toBeInTheDocument();
    });

    it('should handle delete lesson failure', async () => {
        window.history.pushState({}, 'Test page', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });
        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockDeleteLesson.mockRejectedValue(new Error('Delete failed'));

        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            deleteLesson: mockDeleteLesson,
        });

        window.confirm = jest.fn(() => true);

        render(<CourseEditorPage />);
        fireEvent.click(screen.getByText('Delete Lesson'));

        await waitFor(() => {
            expect(mockDeleteLesson).toHaveBeenCalledWith(101);
            expect(consoleSpy).toHaveBeenCalledWith('Failed to delete lesson:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle save course failure', async () => {
        window.history.pushState({}, 'Test page', '/admin/modules/course/new');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockCreateCourse.mockRejectedValue(new Error('Save failed'));

        render(<CourseEditorPage />);
        fireEvent.click(screen.getByText('Save Course'));

        await waitFor(() => {
            expect(mockCreateCourse).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Failed to save course:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle save unit failure', async () => {
        window.history.pushState({}, 'Test page', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });
        const mockCourse = { id: 1, title: 'Existing Course', units: [] };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockCreateUnit.mockRejectedValue(new Error('Save failed'));

        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createUnit: mockCreateUnit,
        });

        render(<CourseEditorPage />);
        fireEvent.click(screen.getByText('Add Unit'));
        fireEvent.click(screen.getByText('Save Unit'));

        await waitFor(() => {
            expect(mockCreateUnit).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Failed to save unit:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle delete unit failure', async () => {
        window.history.pushState({}, 'Test page', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });
        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockDeleteUnit.mockRejectedValue(new Error('Delete failed'));

        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            deleteUnit: mockDeleteUnit,
        });

        window.confirm = jest.fn(() => true);

        render(<CourseEditorPage />);
        fireEvent.click(screen.getByText('Delete Unit'));

        await waitFor(() => {
            expect(mockDeleteUnit).toHaveBeenCalledWith(1);
            expect(consoleSpy).toHaveBeenCalledWith('Failed to delete unit:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle save lesson failure', async () => {
        window.history.pushState({}, 'Test page', '/admin/modules/course/edit/1');
        useParams.mockReturnValue({ courseId: '1' });
        const mockCourse = { id: 1, title: 'Existing Course', units: [{ id: 1, title: 'Unit 1' }] };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockCreateLesson.mockRejectedValue(new Error('Save failed'));

        useModuleManagement.mockReturnValue({
            currentCourse: mockCourse,
            loading: false,
            error: null,
            fetchCourseDetails: mockFetchCourseDetails,
            createLesson: mockCreateLesson,
        });

        render(<CourseEditorPage />);
        fireEvent.click(screen.getByText('Add Lesson'));
        fireEvent.click(screen.getByText('Save Lesson'));

        await waitFor(() => {
            expect(mockCreateLesson).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Failed to save lesson:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('should handle course creation with no ID returned', async () => {
        // Mock new course mode
        const originalLocation = window.location;
        delete window.location;
        window.location = { pathname: '/admin/modules/course/new' };

        const mockCreateCourse = jest.fn().mockResolvedValue({}); // No ID
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        useModuleManagement.mockReturnValue({
            currentCourse: null,
            loading: false,
            error: null,
            createCourse: mockCreateCourse,
            clearError: jest.fn(),
        });

        render(<CourseEditorPage />);

        fireEvent.click(screen.getByText('Save Course'));

        await waitFor(() => {
            expect(mockCreateCourse).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Course created but no ID returned:', {});
        });

        consoleSpy.mockRestore();
        window.location = originalLocation;
    });

    it('should handle course save error', async () => {
        // Mock new course mode
        const originalLocation = window.location;
        delete window.location;
        window.location = { pathname: '/admin/modules/course/new' };

        const mockCreateCourse = jest.fn().mockRejectedValue(new Error('Save failed'));
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        useModuleManagement.mockReturnValue({
            currentCourse: null,
            loading: false,
            error: null,
            createCourse: mockCreateCourse,
            clearError: jest.fn(),
        });

        render(<CourseEditorPage />);

        fireEvent.click(screen.getByText('Save Course'));

        await waitFor(() => {
            expect(mockCreateCourse).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Failed to save course:', expect.any(Error));
        });

        consoleSpy.mockRestore();
        window.location = originalLocation;
    });
});
